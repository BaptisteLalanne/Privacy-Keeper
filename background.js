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

//Listener sur click tab
//Set 
chrome.tabs.onActivated.addListener(function(activeInfo){
	let queryOptions = { active: true, currentWindow: true };
	chrome.tabs.query(queryOptions, function(tabs){
		console.log(tabs)
		console.log(tabs[0].url)
		chrome.cookies.getAll({"url":tabs[0].url},function(cookies){

			chrome.storage.sync.get("updateDateCookies", function(result) {
			  console.log('Value currently is ');console.log(result.value);
			});

	        console.log(cookies);
	        value = {}
	        cookies.forEach(cookie => {
	        	key = "domain"+cookie.domain+"name"+cookie.name
	        	value[key] = Date.now()
	        });
	        console.log(value)
	        chrome.storage.sync.set({"updateDateCookies": value}, function() {
				console.log("Success");
				console.log(value)
			});

			chrome.storage.sync.get("updateDateCookies", function(result) {
			  console.log('Value currently is ');console.log(result.value);
			});
		});
	});
});

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

