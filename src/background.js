chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log("[BACKGROUND] Tab updated");
    if (changeInfo.status === 'complete' && tab.url) {
        console.log("[BACKGROUND] Active tab");
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: injectMe
        });
    }
})

// Background listener
chrome.runtime.onConnect.addListener(function (port) {
    console.log("[BACKGROUND] Port name: " + port.name);
    port.onMessage.addListener(function (msg) {
        switch (port.name) {
            case "truc":
                console.log("[BACKGROUND] received : " + msg.answer)
                break;
        }
    });
});


const injectMe = () => {
    //This class implements all methods to analyse trackers whithin a web page
    const scripts = document.scripts;
    console.log("Nb of scripts: " + scripts.length);

    let nbBeacon = 0;
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src) {
            externalSourceLink = scripts[i].src;
            console.log(externalSourceLink);

        }
        const scriptContent = scripts[i].text;
        if (scriptContent.includes("sendBeacon")) {
            console.log("FOUND Beacon!")
            nbBeacon++;
        }
    }
    console.log("Nb of beacons found: " + nbBeacon);

    let port = chrome.runtime.connect({ name: "truc" });
    port.postMessage({ answer: "yo" });
    /*
    port.onMessage.addListener(function (msg) {
        console.log("[EXTENSIONS] Response: " + msg.answer);
    });
    */
}