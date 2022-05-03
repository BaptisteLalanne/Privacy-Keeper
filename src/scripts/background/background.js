// Import cookie classification
importScripts('./modules/third_party/lz-string.js');
importScripts('./modules/third_party/levenshtein.js');
importScripts('./modules/third_party/difflib-browser.js');
importScripts('./modules/globals.js');
importScripts('./modules/extractor.js');
importScripts('./modules/predictor.js');
importScripts('./modules/classifier.js');

// Other imports
import fingerprinterScript from "./injectTrackerAnalyser.js"

// When the app is first installed, write default settings
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {

        // set default value for parameters
        let default_options = {
            autoDeleteOldCookies: false,
            blockTrackers: false,
            blockCookies: false,
        };
        let default_expiration_time = 1//4 * (1000 * 60 * 60 * 24);
        let labels = [0, 0, 0, 0];
        let fingerPrintAnalyseResult = {
            "score": 0,
            "fingerPrintComment": ""
        };
        let default_params = {
            "updateDateCookies": {},
            "expiration_time": default_expiration_time,
            "cookieDeletedHistory": {},
            "whitelist": {},
            "manuallyDeletedCookies": {
                timestamp1: {
                    type1: 0,
                    type2: 0
                },
                timestamp2: {
                    type1: 0
                }
            },
            "toggle_options": default_options,
            "cookieTypes": {},
            "currentCookieTypes": labels,
            "fingerprintAnalyseResult": fingerPrintAnalyseResult
        };
        chrome.storage.sync.set(default_params, function () {
            if (chrome.runtime.error) {
                console.log("Runtime error : expiration_time");
            }
        });

        // Set unused cookies whitelist
        let default_unused_cookies_wl = [];
        chrome.storage.sync.set({"unused_cookies_wl": default_unused_cookies_wl}, function () {
            if (chrome.runtime.error) {
                console.log("Runtime error : unused_cookies_wl");
            }
        });
    }
})

//Listen when the browser is opened
chrome.windows.onCreated.addListener(function () {

    console.log("[BROWSER OPENED]");

    //Getting toggle options
    chrome.storage.sync.get("toggle_options", async function (result) {

        if (result && result.toggle_options && result.toggle_options.autoDeleteOldCookies) {

            let whitelist
            //Getting whitelist
            await chrome.storage.sync.get("unused_cookies_wl", function (result) {
                if (result && result.unused_cookies_wl) {
                    whitelist = result.unused_cookies_wl
                }
            });

            //Getting data
            await chrome.storage.sync.get("updateDateCookies", async function (result) {

                //Time after which unused cookies are deleted
                let max_diff = await chrome.storage.sync.get("expiration_time") // Retrieving cookie expiration time -> default is 1000 * 60 * 60 * 24 * 7 * 2; //2 weeks
                max_diff = max_diff.expiration_time

                //data fetched
                if (result && result["updateDateCookies"])
                    result = result["updateDateCookies"];
                else
                    result = {};

                let value = {};

                let date_now = Date.now().toString();

                //Getting all the cookies
                await chrome.cookies.getAll({}).then(cookies => {

                    let key;
                    cookies.forEach(cookie => {

                        let found = false
                        for (const domain of whitelist) {
                            if (cookie.domain.includes(domain)) {
                                found = true
                                break
                            }
                        }

                        if (!found) {
                            key = "domain" + cookie.domain + "name" + cookie.name;

                            //If we don't have a date in the storage for the cookie we add it
                            if (!result[key]) {
                                value[key] = date_now;
                            }

                            //We check if the cookie hasn't been used for too long
                            else if (result[key] && date_now - result[key] > max_diff) {
                                //Delete cookie
                                chrome.cookies.remove({
                                    "name": cookie.name,
                                    "storeId": cookie.storeId,
                                    "url": "https://" + cookie.domain + cookie.path
                                }, function () {
                                    delete result[key]
                                    if (chrome.runtime.lastError) {
                                        console.log("Runtime error.");
                                    }
                                });
                            }
                            //If lower than max_diff
                            else {
                                value[key] = result[key];
                            }
                        }

                    })
                }).catch(err => console.log(err));

                //We put the now upodated cookies' date in the storage
                await chrome.storage.sync.set({"updateDateCookies": value}).then(() => {
                    if (chrome.runtime.error) {
                        console.log("Runtime error.");
                    }
                }).catch(err => console.log(err));

            });


        }
    });

});


//To update the last time a cookie was used
//Listen to new tabs
chrome.tabs.onActivated.addListener(setInfos);
//Listener to updated tabs (when the url is modifies for instance)
chrome.tabs.onUpdated.addListener(setInfos);


function setInfos() {

    //Query the active tab
    let queryOptions = {active: true, currentWindow: true};
    chrome.tabs.query(queryOptions, function (tabs) {

        if (tabs.length > 0 && tabs[0].url !== "") {

            // Exit if this is a chrome tab
            if (tabs[0].url.includes("chrome://")) {
                return;
            }

            //Getting all the cookie whose url matches the active tab
            chrome.cookies.getAll({"url": tabs[0].url}, function (cookies) {

                //Getting stored cookies' dates
                chrome.storage.sync.get("updateDateCookies", function (result) {

                    // Getting them only if they exist
                    let value = {};
                    if (result && result["updateDateCookies"]) {
                        value = result["updateDateCookies"];
                    }

                    //Updating cookies' dates
                    let date_now = Date.now().toString()
                    let key;
                    cookies.forEach(cookie => {
                        key = "domain" + cookie.domain + "name" + cookie.name;
                        value[key] = date_now;
                    });

                    //Putting the new date into the sync storage
                    chrome.storage.sync.set({"updateDateCookies": value}, function () {
                        if (chrome.runtime.error) {
                            console.log("Runtime error.");
                        }
                    });
                });
            });
        }
    });
}

const injectScripts = (idTab, script) => {
    chrome.scripting.executeScript({
        target: {tabId: idTab},
        function: script
    });
}

chrome.tabs.onActivated.addListener(function (tab, changeInfo) {

    console.log("[BACKGROUND] Tab activated");
    //Query the active tab
    let queryOptions = {active: true, currentWindow: true};
    chrome.tabs.query(queryOptions, function (tabs) {
        if (tabs.length > 0 && tabs[0].url !== "") {

            // Exit if this is a chrome tab
            if (tabs[0].url.split(":")[0].includes("chrome")) {
                return;
            }

            // Otherwise inject analysis scripts
            injectScripts(tab.tabId, fingerprinterScript);
        }
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log("[BACKGROUND] Tab updated");
    if (changeInfo.status === 'complete' && tab.url) {

        // Exit if this is a chrome tab
        if (tab.url.split(":")[0].includes("chrome")) {
            return;
        }

        // Otherwise inject analysis scripts
        injectScripts(tabId, fingerprinterScript);

    }
});


// Background listener
chrome.runtime.onConnect.addListener(function (port) {
    console.log("[BACKGROUND] Port name: " + port.name);
    port.onMessage.addListener(function (msg) {
        switch (port.name) {
            case "beacons":
                console.log("[BACKGROUND] received nb beacons: " + msg.nb)
                // save nb beacons
                chrome.storage.sync.set({beacons: msg.nb});
                break;
        }
    });
});