chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
        chrome.scripting.executeScript(tabId, {file: './inject_script.js'}, function () {
            chrome.scripting.executeScript(tabId, {file: './foreground.bundle.js'}, function () {
                console.log('INJECTED AND EXECUTED');
            });
        });
    }
});

//Listener sur ouverture browser
chrome.windows.onCreated.addListener(function () {
    //On recupere nos donnees
    chrome.storage.local.get("updateDateCookies", async function (result) {

        //duree a partir de laquelle on delete un cookie (en ms)
        //a set dans settings (via storage)
        let max_diff = 1000 * 60 * 60 * 24 * 7 * 2; //2 semaines

        //les donnees recuperees
        if (result && result["updateDateCookies"])
            result = result["updateDateCookies"];
        else
            result = {};

        let value = {};

        //date d'aujourd'hui (en ms)
        let date_now = Date.now().toString();

        //On recupere les cookies
        await chrome.cookies.getAll({}).then(cookies => {
            let key;
            cookies.forEach(cookie => {
                key = "domain" + cookie.domain + "name" + cookie.name;

                //Si on n'a pas de date pour le cookie das le storage on l'ajoute
                if (!result[key]) {
                    value[key] = date_now;
                }
                //On check si le cookie est inutilisé depuis trop longtemps
                else if (result[key] && date_now - result[key] > max_diff) {
                    //Delete cookie (url = domain ? idk how to get CookieDetails)
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
                //Si ca fait moins de max_diff
                else {
                    value[key] = date_now;
                }
            })
        }).catch(err => console.log(err));

        //On met les données modifiées dans le storage
        await chrome.storage.local.set({"updateDateCookies": value}).then(() => {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            }
        }).catch(err => console.log(err));
    });
});

//Permet d'update la date de dernière mise à jour des cookies
//Listener sur active tab
chrome.tabs.onActivated.addListener(setInfos);
//Listener sur update tab (changement d'url par ex)
chrome.tabs.onUpdated.addListener(setInfos);


function setInfos() {

    //On query la tab active (avec le listener on a simplement le tabId & windowId)
    let queryOptions = {active: true, currentWindow: true};
    chrome.tabs.query(queryOptions, function (tabs) {
        if (tabs.length > 0 && tabs[0].url !== "") {

            //On récupère la totalité des cookies lié à l'url de la page
            chrome.cookies.getAll({"url": tabs[0].url}, function (cookies) {

                //On récupère les données déjà présentes
                chrome.storage.local.get("updateDateCookies", function (result) {
                    let value;
                    //on recupère les données si elles sont présentes
                    if (result && result["updateDateCookies"])
                        value = result["updateDateCookies"];
                    else
                        value = {};

                    console.log("result");
                    console.log(value);
                    //On insère les cookies dans la value
                    let date_now = Date.now().toString()
                    let key;
                    cookies.forEach(cookie => {
                        key = "domain" + cookie.domain + "name" + cookie.name;
                        value[key] = date_now;
                    });
                    //On met la value dans le storage
                    chrome.storage.local.set({"updateDateCookies": value}, function () {
                        if (chrome.runtime.error) {
                            console.log("Runtime error.");
                        }
                    });
                });
            });
        }
    });

    chrome.cookies.getAll({}, function (cookies) {
        console.log("All cookies :");
        console.log(cookies);
    })
}
