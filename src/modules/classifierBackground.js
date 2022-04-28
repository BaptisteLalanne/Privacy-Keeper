// LISTENERS

const classifyCookiesTab = (activeInfo) => {

    console.log("[CLASSIFIER BACKGROUND] Tab activated")

    const queryOptions = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryOptions, async function (tabs) {
        if (tabs.length > 0 && tabs[0].url !== "") {

            chrome.storage.sync.set({"currentCookieTypes": [0,0,0,0]}, function() {

                //Getting all the cookie whose url matches the active tab
                chrome.cookies.getAll({"url": tabs[0].url}, function (cookies) {

                    handleCookies(cookies);

                    /*
                    let allLabels = [0,0,0,0];

                    for (let cookie of cookies) {
                        console.log("[BACKGROUND] cookie: ");
                        console.log(cookie);
                        let label = 
                        allLabels[label] = allLabels[label]+1;
                    }

                    chrome.storage.sync.set({cookiesClassification: allLabels}, function() {
                        // console.log("saved finally:");
                        console.log(allLabels);
                    });
                    */
                    
                });
            });
            
        }
    });

}

chrome.tabs.onActivated.addListener(classifyCookiesTab);


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

// Variables for all the user options, which is persisted in storage.local and storage.sync
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
const createFEInput = function(cookie) {
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
const updateFEInput = async function(storedFEInput, rawCookie) {

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
const classifyCookie = async function(cookieDat, feature_input) {

    // console.log("[CLASSIFIER BACKGROUND] entering classifyCookie");

    let features = extractFeatures(feature_input);
    //label = await predictClass(features, cblk_pscale);
    label = await predictClass(features, 1);
    
    // console.log("[CLASSIFIER BACKGROUND] leaving classifyCookie");

    return label;
};


/**
 * Retrieve the cookie, classify it, then apply the policy.
 * @param {Object} newCookie Raw cookie object directly from the browser.
 * @param {Object} storeUpdate Whether
 */
 const handleCookies = async function (newCookies){

    let labels = [0,0,0,0];
    let cookieTypes = {};

    for (let cookie of newCookies) {
        serializedCookie = createFEInput(cookie);
    
        //console.log("[BACKGROUND] serialized cookie:");
        //console.log(serializedCookie);
    
        console.assert(serializedCookie !== undefined, "Cookie object was still undefined!");
        
        // Classify cookie
        let clabel = await classifyCookie(cookie, serializedCookie);

        // Count cookies
        labels[clabel] = labels[clabel] + 1;
        
        // Save type in local storage
        let key = "domain" + cookie.domain + "name" + cookie.name;
        cookieTypes[key] = clabel;

    }

    console.log("[CLASSIFIER BACKGROUND] cookieClassification saved");
    console.log(labels);

    // Save current tab's cookie repartition
    chrome.storage.sync.set({"currentCookieTypes": labels});

    // Update gobal cookie types map
    chrome.storage.local.get(["cookieTypes"], res => {
        let data = {};
        if (res && res.cookieTypes) {
            data = res.cookieTypes;
        }
        newData = {...data, ...cookieTypes};
        console.log("SFHLSDHSDLFBFSD")
        console.log(newData);
        chrome.storage.local.set({ "cookieTypes": newData });
    });
    
}

// Load the default configuration
getExtensionFile(chrome.runtime.getURL("ext_data/default_config.json"), "json", (dConfig) => {
    initDefaults(dConfig, false)
});

// retrieve the configuration
getExtensionFile("ext_data/features.json", "json", setupFeatureResourcesCallback);