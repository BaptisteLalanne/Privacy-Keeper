/*chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
        chrome.scripting.executeScript(tabId, {file: './inject_script.js'}, function () {
            chrome.scripting.executeScript(tabId, {file: './dashboard.bundle.js'}, function () {
                console.log('INJECTED AND EXECUTED');
            });
        });
    }
});*/

//Listen when the browser is opened
chrome.windows.onCreated.addListener(function () {
    //Getting data
    chrome.storage.local.get("updateDateCookies", async function (result) {

        //Time after which unused cookies are deleted
        //To be set in settings
        let max_diff = 1000 * 60 * 60 * 24 * 7 * 2; //2 weeks

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
            })
        }).catch(err => console.log(err));

        //We put the now upodated cookies' date in the storage
        await chrome.storage.local.set({"updateDateCookies": value}).then(() => {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            }
        }).catch(err => console.log(err));
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

            //Getting all the cookie whose url matches the active tab
            chrome.cookies.getAll({"url": tabs[0].url}, function (cookies) {

                //Getting stored cookies' dates
                chrome.storage.local.get("updateDateCookies", function (result) {
                    let value;
                    // Getting them only if they exist
                    if (result && result["updateDateCookies"])
                        value = result["updateDateCookies"];
                    else
                        value = {};

                    //Updating cookies' dates
                    let date_now = Date.now().toString()
                    let key;
                    cookies.forEach(cookie => {
                        key = "domain" + cookie.domain + "name" + cookie.name;
                        value[key] = date_now;
                    });
                    //Putting the new date into the local storage
                    chrome.storage.local.set({"updateDateCookies": value}, function () {
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
        target: { tabId: idTab },
        function: script
    });
}

chrome.tabs.onActivated.addListener(function (tab, changeInfo) {
    console.log("[BACKGROUND] Tab activated");
    injectScripts(tab.tabId, fingerprinterScript);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
        console.log("[BACKGROUND] Tab updated");
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
                chrome.storage.sync.set({ beacons : msg.nb });
                break;
        }
    });
});

const fingerprinterScript = () => {
    /**
     * Returns the number of times strings in an array are present in a text
     */
    const findElementFromArrayInText = (array, text) => {
        let nbAppearance = 0;
        array.forEach((element) => {
            if(text.includes(element)){
                nbAppearance ++;
            }
        });
        return nbAppearance;
    }
    
    //This class implements all methods to analyse trackers whithin a web page
    const scripts = document.scripts;
    console.log("Nb of scripts: " + scripts.length);

    // Access to navigator properties
    let navigatorProperties = ["appCodeName", "appName", "appVersion",
    "buildID", "cookieEnabled", "doNotTrack",
    "geolocation", "language", "languages",
    "onLine", "oscpu", "platform", "product",
    "productSub", "userAgent", "vendorSub",
    "vendor", "javaEnabled", "permissions",
    "mediaDevices", "webdriver", "hardwareConcurrency",
    "maxTouchPoints", "activeVRDisplays"];

    // Access to Navigator methods
    let navigatorPropertiesToInstrument = ["vibrate", "sendBeacon", "getGamepads"];

    // Access to plugins
    let pluginProperties = ["name", "filename", "description", "version", "length"];

    // Access to MIMETypes
    let mimeTypeProperties = ["description", "suffixes", "type"];

    // Access to Audio API
    let audioProperties = ["AudioContext", "OfflineAudioContext", "OscillatorNode", "AnalyserNode", "GainNode", "ScriptProcessorNode"];

    let navigatorPropertiesCount = 0;
    let navigatorPropertiesToInstrumentCount = 0; 
    let pluginPropertiesCount = 0;
    let mimeTypePropertiesCount = 0;
    let audioPropertiesCount = 0;

    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src) {
            externalSourceLink = scripts[i].src;
            console.log(externalSourceLink);

        }
        const scriptContent = scripts[i].text;

        navigatorPropertiesCount += findElementFromArrayInText(navigatorProperties, scriptContent);
        navigatorPropertiesToInstrumentCount += findElementFromArrayInText(navigatorPropertiesToInstrument, scriptContent);
        pluginPropertiesCount += findElementFromArrayInText(pluginProperties, scriptContent);
        mimeTypePropertiesCount += findElementFromArrayInText(mimeTypeProperties, scriptContent);
        audioPropertiesCount += findElementFromArrayInText(audioProperties, scriptContent);
    }
    console.log("navigatorPropertiesCount: " + navigatorPropertiesCount);
    console.log("navigatorPropertiesToInstrumentCount: " + navigatorPropertiesToInstrumentCount);
    console.log("pluginPropertiesCount: " + pluginPropertiesCount);
    console.log("mimeTypePropertiesCount: " + mimeTypePropertiesCount);
    console.log("audioPropertiesCount: " + audioPropertiesCount);
    let total = (navigatorPropertiesCount+navigatorPropertiesToInstrumentCount+pluginPropertiesCount+mimeTypePropertiesCount+audioPropertiesCount);
    console.log("Total = " + total);

    let score = 0;

    if(total<=10)
        score = 0;
    else if (total >= 90)
        score = 100;
    else
        score = 1.25 * total - 10;
        
    console.log("Score : " + score);

    chrome.storage.sync.set({'fingerprintScore': score}, function() {});

}