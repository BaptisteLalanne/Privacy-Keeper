//Listener sur ouverture browser
/*chrome.windows.onCreated.addListener(function() {
	const cookiesPromise = chrome.cookies.getAll({});
	cookiesPromise.then(logCookies)
	function logCookies(cookies){
		cookies.forEach(cookie => {
			key = "domain"+cookie.domain+"name"+cookie.name
			// delete key if date - now > dateMax
		})
		//console.log(cookies)
	}
	console.log("Here")
});*/

//Check for changes (cookies)
/*chrome.cookies.onChanged.addListener(function(changeinfo){

})*/



//Permet d'update la date de dernière mise à jour des cookies
//Listener sur active tab
chrome.tabs.onActivated.addListener(setInfos)
//Listener sur update tab (changement d'url par ex)
chrome.tabs.onUpdated.addListener(setInfos)


function setInfos(activeInfo){
	
	//On query la tab active (avec le listener on a simplement le tabId & windowId)
	let queryOptions = { active: true, currentWindow: true };
	chrome.tabs.query(queryOptions, function(tabs){
		if(tabs.length > 0 && tabs[0].url != ""){
			console.log(tabs)
			console.log(tabs[0].url)

			//On récupère la totalité des cookies lié à l'url de la page
			chrome.cookies.getAll({"url":tabs[0].url},function(cookies){

				console.log("Cookies :")
				console.log(cookies)

				//Pour clear le storage
				/*chrome.storage.sync.clear(function() {
						if (chrome.runtime.error) {
							console.log("Runtime error.");
						}
						console.log("Set done")
					});*/


				//On récupère les données déjà présentes
				chrome.storage.sync.get("updateDateCookies", function(result) {
					console.log("Get")
					let value;
					//on recupère les données si elles sont présentes
					if(result && result["updateDateCookies"])
						value = result["updateDateCookies"]
					else 
						value = {}
					//On insère les cookies dans la value
					date_now = Date.now().toString()
					cookies.forEach(cookie => {
		        		key = "domain"+cookie.domain+"name"+cookie.name
		        		value[key] = date_now
		        	});
		        	//On met la value dans le storage
		        	chrome.storage.sync.set({"updateDateCookies": value}, function() {
						if (chrome.runtime.error) {
							console.log("Runtime error.");
						}
						console.log("Set done")
					});
				});
				//On get tout le storage pour vérifier
				chrome.storage.sync.get(null, function(result) {
					console.log('Value currently is (from null) ');console.log(result);
				});
			});
		}
	});
};

/*chrome.tabs.onActivated.addListener(function(activeInfo){
	let queryOptions = { active: true, currentWindow: true };
	chrome.tabs.query(queryOptions, function(tabs){
		console.log(tabs)
		console.log(tabs[0].url)

		chrome.cookies.getAll({"url":tabs[0].url},function(cookies){

			chrome.storage.sync.get("updateDateCookies", function(result) {
				
			  console.log('Value currently is ');console.log(result);
			});

	        console.log(cookies);
	        value = {}
	        cookies.forEach(cookie => {
	        	key = "domain"+cookie.domain+"name"+cookie.name
	        	value[key] = Date.now().toString()
	        });
	        console.log("Value : ")
	        console.log(value)
	        //value = "hello"
	        //chrome.storage.sync.set({"updateDateCookies": JSON.stringify(value)}, function() {
	        console.log({"updateDateCookies": value})
	       	chrome.storage.sync.set({"updateDateCookies": value}, function() {
				if (chrome.runtime.error) {
					console.log("Runtime error.");
				}
				console.log("success")
			});

			chrome.storage.sync.get("updateDateCookies", function(result) {
			  console.log('Value currently is ');console.log(result);
			});

			chrome.storage.sync.get(null, function(result) {
			  console.log('Value currently is (from null) ');console.log(result);
			});
		});
	});
});*/

/*
chrome.storage.sync.set({key: value}, function() {
  console.log('Value is set to ' + value);
});

chrome.storage.sync.get(['key'], function(result) {
  console.log('Value currently is ' + result.key);
});*/

//Scripting
/*chrome.scripting.executeScript({
	    target: { tabId: activeInfo.tabId},
	    function: getDocumentCookies,
	});
function getDocumentCookies() {
   console.log("hello")
   console.log(document.cookie)
   document.cookie
}*/

//get active tabs & cookies
/*
chrome.tabs.query({"status":"complete","windowId":chrome.windows.WINDOW_ID_CURRENT,"active":true}, function(tab){
            console.log(JSON.stringify(tab));
            chrome.cookies.getAll({"url":tab[0].url},function (cookie){
                console.log(cookie.length);
                allCookieInfo = "";
                for(i=0;i<cookie.length;i++){
                    console.log(JSON.stringify(cookie[i]));

                    allCookieInfo = allCookieInfo + JSON.stringify(cookie[i]);
                }
                localStorage.currentCookieInfo = allCookieInfo;
            });
    });
*/

