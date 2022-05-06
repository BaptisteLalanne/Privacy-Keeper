// LISTENERS
const classifyCookiesTab = (activeInfo) => {

    const queryOptions = {
        active: true,
        currentWindow: true
    };
    chrome.tabs.query(queryOptions, async function (tabs) {
        if (tabs.length > 0 && tabs[0].url !== "" && !tabs[0].url.split(":")[0].includes("chrome")) {
            chrome.storage.local.set({ "currentCookieTypes": [0, 0, 0, 0] }, function () {
                //Get all the cookie whose url matches the active tab
                chrome.cookies.getAll({ "url": tabs[0].url }, function (cookies) {
                    handleCookies(cookies, tabs[0].url);
                });
            });
        }
    });

}

// HELPER FUNCTIONS
const mapRange = (x, min1, max1, min2, max2) => {
    return clamp((x - min1) / (max1 - min1) * (max2 - min2) + min2, min2, max2);
}
const clamp = (x, min, max) => {
    if (x > max) return max;
    if (x < min) return min;
    return x;
}
// Extract domain from URL
function extractDomain(fullUrl) {
    let domain = fullUrl.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
    if (domain[0] == '.') domain = domain.substr(1);
    if (domain.substr(0, 4) == "www.") domain = domain.substr(4);
    return domain;
}

//-------------------------------------------------------------------------------
/*
Copyright (C) 2021-2022 Dino Bollinger, ETH Zürich, Information Security Group

This file is part of CookieBlock.

Released under the MIT License, see included LICENSE file.
*/
//-------------------------------------------------------------------------------

// local counters for debugging
var debug_httpRemovalCounter = 0;
var debug_httpsRemovalCounter = 0;
var debug_classifyAllCounter = [0, 0, 0, 0];

// debug performance timers (FE, FE + Prediction)
var debug_perfsum = [0.0, 0.0, 0.0];
var debug_perfsum_squared = [0.0, 0.0, 0.0];
var debug_maxTime = [0.0, 0.0, 0.0];
var debug_minTime = [1e10, 1e10, 1e10];

var debug_Ntotal = [0, 0, 0];
var debug_Nskipped = 0;

// Variables for all the user options, which is persisted in storage.local and storage.local
// Retrieving these from disk all the time is a bottleneck.
var cblk_userpolicy = undefined;
var cblk_pscale = undefined;
var cblk_pause = undefined;
var cblk_ulimit = undefined;
var cblk_hconsent = undefined;
var cblk_exglobal = undefined;
var cblk_exfunc = undefined;
var cblk_exanal = undefined;
var cblk_exadvert = undefined;
var cblk_mintime = undefined;
var cblk_knowncookies = undefined;
var cblk_useinternal = undefined;

// lookup for known cookies, to prevent some critical login issues
// will be imported form an external file and kept here
var knownCookies_user = undefined;
var knownCookies_internal = undefined;

// key used to access the regular expression pattern in the known_cookies object
const regexKey = "~regex;";

/**
* Creates a new feature extraction input object from the raw cookie data.
* @param  {Object} cookie    Raw cookie data as received from the browser.
* @return {Promise<object>}  Feature Extraction input object.
*/
const createFEInput = function (cookie) {
    return {
        "name": encodeURI(cookie.name),
        "domain": encodeURI(cookie.domain),
        "path": encodeURI(cookie.path),
        "current_label": -1,
        "label_ts": 0,
        "storeId": encodeURI(cookie.storeId),
        "variable_data":
            [
                {
                    "host_only": cookie.hostOnly,
                    "http_only": cookie.httpOnly,
                    "secure": cookie.secure,
                    "session": cookie.session,
                    "expirationDate": cookie.expirationDate,
                    "expiry": datetimeToExpiry(cookie),
                    "value": encodeURI(cookie.value),
                    "same_site": encodeURI(cookie.sameSite),
                    "timestamp": Date.now()
                }
            ]
    };
}

/**
 * Updates the existing feature extraction object with data from the new cookie.
 * Specifically, the variable data attribute will have the new cookie's data appended to it.
 * If the update limit is reached, the oldest update will be removed.
 * @param  {Object} storedFEInput   Feature Extraction input, previously constructed.
 * @param  {Object} rawCookie       New cookie data, untransformed.
 * @return {Promise<object>}        The existing cookie object, updated with new data.
 */
const updateFEInput = async function (storedFEInput, rawCookie) {

    let updateArray = storedFEInput["variable_data"];
    let updateLimit = cblk_ulimit;

    let updateStruct = {
        "host_only": rawCookie.hostOnly,
        "http_only": rawCookie.httpOnly,
        "secure": rawCookie.secure,
        "session": rawCookie.session,
        "expiry": datetimeToExpiry(rawCookie),
        "value": encodeURI(rawCookie.value),
        "same_site": encodeURI(rawCookie.sameSite),
        "timestamp": Date.now()
    };

    // remove head if limit reached
    if (updateArray.length >= updateLimit)
        updateArray.shift();

    updateArray.push(updateStruct);
    console.assert(updateArray.length > 1, "Error: Performed an update without appending to the cookie?");
    console.assert(updateArray.length <= updateLimit, "Error: cookie update limit still exceeded!");

    return storedFEInput;
};


/**
 * Using the cookie input, extract features from the cookie and classify it, retrieving a label.
 * @param  {Object} feature_input   Transformed cookie data input, for the feature extraction.
 * @return {Promise<Number>}        Cookie category label as an integer, ranging from [0,3].
 */
const classifyCookie = async function (feature_input) {
    let label = -1;
    try {
        let features = extractFeatures(feature_input);
        label = await predictClass(features, 1);
    } catch (error) {
        console.error(error);
    }
    return label;
};

/**
 * Retrieve the cookie, classify it, then apply the policy.
 */
const handleCookies = async function (newCookies, url) {

    let domain = extractDomain(url);
    let isInWhitelist = false;

    let labels = [0, 0, 0, 0];
    let maxExpirationTimes = [0, 0, 0, 0];
    let currCookieTypes = {};
    const MAX_DURATION = 365 * (24 * 60 * 60);
    const MAX_DATE = Date.now() / 1000 + MAX_DURATION;

    // Get already stored classifications
    chrome.storage.local.get(["cookieTypes"], async (res) => {

        let prevCookieTypes = {};
        if (res && res.cookieTypes) {
            prevCookieTypes = res.cookieTypes;
        }
        let newCookieTypes = {};

        // Get settings
        chrome.storage.local.get("toggle_options", async function (res) {

            let blockCookies = false;
            if (res && res.toggle_options) {
                blockCookies = res.toggle_options.blockCookies;
            }

            // Get whitelist
            chrome.storage.local.get("whitelist", async function (res) {

                let whitelist = [];
                if (res && res.whitelist) {
                    whitelist = res.whitelist;
                }

                // Get blocked cookies
                chrome.storage.local.get("blockedCookies", async function (result) {

                    let blockedCookies = {};
                    if (result && result.blockedCookies) {
                        blockedCookies = result.blockedCookies;
                        if (!blockedCookies[domain]) {
                            blockedCookies[domain] = {};
                        }
                    }

                    // Get blocked cookies
                    chrome.storage.local.get("blockedCookiesHistory", async function (result) {

                        let blockedCookiesHistory = {};
                        if (result && result.blockedCookiesHistory) {
                            blockedCookiesHistory = result.blockedCookiesHistory;
                        }

                        // Iterate through cookies
                        for (let cookie of newCookies) {

                            let key = "domain" + cookie.domain + "name" + cookie.name;

                            let getClassification =

                                // If cookie has already been classified,
                                prevCookieTypes[key] != undefined ?

                                    async () => {

                                        // Fetch stored classification
                                        return prevCookieTypes[key];

                                    }

                                    // If cookie has not alreayd been classified,
                                    :

                                    async () => {

                                        // Classify it
                                        let serializedCookie = createFEInput(cookie);
                                        let res = await classifyCookie(serializedCookie);

                                        // Store the result
                                        currCookieTypes[key] = res;

                                        return res;
                                    }

                                ;

                            let ctype = await getClassification();

                            // Block cookies
                            let hasBeenBlocked = false;
                            if (blockCookies) {

                                // Check if it's not in whitelist
                                let found = false;
                                for (let whitelistedDomain of whitelist) {
                                    if (cookie.domain.includes(whitelistedDomain) || whitelistedDomain.includes(cookie.domain)) {
                                        found = true;
                                        isInWhitelist = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    if (ctype > 1 && cookie.value != "") {

                                        let cookieUrl = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
                                        // Remove cookie right away
                                        chrome.cookies.remove({ url: cookieUrl, name: cookie.name });
                                        hasBeenBlocked = true;

                                        // Store removed cookies
                                        blockedCookies[domain][cookie.name] = cookie;

                                        // Store number of removed cookies
                                        let currTimestamp = new Date();
                                        let currDate = currTimestamp.getDate() + "/" + currTimestamp.getMonth() + "/" + currTimestamp.getFullYear();
                                        if (blockedCookiesHistory[currDate] == undefined) {
                                            blockedCookiesHistory[currDate] = [0, 0];
                                            blockedCookiesHistory[currDate][ctype - 2] = 1;
                                        }
                                        else {
                                            blockedCookiesHistory[currDate][ctype - 2] += 1;
                                        }

                                    }
                                }
                            }
                            newCookieTypes = { ...prevCookieTypes, ...currCookieTypes };

                            // Count cookie types, keep track of longest expiration date
                            if (!hasBeenBlocked) {
                                labels[ctype] += 1;
                                if (!cookie.expirationDate) { maxExpirationTimes[ctype] = MAX_DATE; }
                                else { maxExpirationTimes[ctype] = Math.max(maxExpirationTimes[ctype], cookie.expirationDate); }
                            }

                        }

                        // Count in previously blocked cookies
                        if (blockCookies && !isInWhitelist && blockedCookies[domain]) {
                            for (const [name, cookie] of Object.entries(blockedCookies[domain])) {
                                let key = "domain" + cookie.domain + "name" + cookie.name;
                                let type = newCookieTypes[key];
                                labels[type] += 1;
                                if (!cookie.expirationDate) { maxExpirationTimes[type] = MAX_DATE; }
                                else { maxExpirationTimes[type] = Math.max(maxExpirationTimes[type], cookie.expirationDate); }
                            }
                        }

                        // Compute score
                        let thresholds = [0, 2, 35, 65, 100];
                        let baseScore = 0;
                        let additionalScore = 0;
                        for (let i = 3; i >= 0; i--) {
                            if (labels[i] > 0) {
                                baseScore = thresholds[i];
                                additionalScore = mapRange(maxExpirationTimes[i] - Date.now() / 1000, 5 * (24 * 60 * 60), MAX_DURATION, 0, thresholds[i + 1] - thresholds[i]);
                                break;
                            }
                        }
                        let score = baseScore + additionalScore;


                        // Save current tab's cookie score and repartition 
                        chrome.storage.local.set({ "currentCookieTypes": labels });
                        chrome.storage.local.set({ "cookieScore": score });

                        // Alter score history
                        chrome.storage.local.get("scoreHistory", function (res) {
                            let scoreHistory = {};
                            if (res && res.scoreHistory) { scoreHistory = res.scoreHistory; }
                            let currTimestamp = new Date();
                            let currDate = currTimestamp.getDate() + "/" + currTimestamp.getMonth() + "/" + currTimestamp.getFullYear();
                            if (scoreHistory[currDate] == undefined) {
                                scoreHistory[currDate] = {
                                    "trackerSum": 0,
                                    "cookieSum": score,
                                    "total": 1
                                }
                            }
                            else {
                                scoreHistory[currDate].cookieSum += score;
                                scoreHistory[currDate].total += 1;
                            }
                            chrome.storage.local.set({ "scoreHistory": scoreHistory });
                        });

                        // Update stored scores
                        chrome.storage.local.get("websiteScores", function (res) {
                            let websiteScores = {};
                            if (res && res.websiteScores) { websiteScores = res.websiteScores; }
                            if (websiteScores[domain] == undefined) {
                                websiteScores[domain] = {
                                    "cookie": score,
                                    "tracker": 0
                                }
                            }
                            else {
                                websiteScores[domain].cookie = score;
                            }
                            chrome.storage.local.set({ "websiteScores": websiteScores });
                        });

                        // Update gobal cookie types map
                        chrome.storage.local.set({ "cookieTypes": newCookieTypes });

                        // Save the deleted cookies
                        chrome.storage.local.set({ "blockedCookies": blockedCookies });
                        chrome.storage.local.set({ "blockedCookiesHistory": blockedCookiesHistory });

                    });
                });
            });
        });
    });

}

function updateCookieClassification(cookies) {

    // Get already stored classifications
    chrome.storage.local.get(["cookieTypes"], async (res) => {

        let prevCookieTypes = {};
        if (res && res.cookieTypes) {
            prevCookieTypes = res.cookieTypes;
        }
        let currCookieTypes = {};
        let newCookieTypes = {};

        // Iterate through cookies
        for (let cookie of cookies) {

            let key = "domain" + cookie.domain + "name" + cookie.name;

            let getClassification =

                // If cookie has already been classified,
                prevCookieTypes[key] != undefined ?

                    async () => {

                        // Fetch stored classification
                        return prevCookieTypes[key];

                    }

                    // If cookie has not alreayd been classified,
                    :

                    async () => {

                        // Classify it
                        let serializedCookie = createFEInput(cookie);
                        let res = await classifyCookie(serializedCookie);

                        // Store the result
                        currCookieTypes[key] = res;

                        return res;
                    }

                ;

            await getClassification();

        }

        newCookieTypes = { ...prevCookieTypes, ...currCookieTypes };


        // Update gobal cookie types map
        chrome.storage.local.set({ "cookieTypes": newCookieTypes });

    });

}