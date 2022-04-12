document.getElementById("getCookies").addEventListener("click", async function(){
	console.log("Hello")
	//const cookieStorage = await chrome.cookies.getAllCookieStores();
	//console.log(cookieStorage);
	const cookies = await chrome.cookies.getAll({
	  domain: "<all_urls>"
	});
	console.log(cookies)
	const cookies2 = await chrome.cookies.getAll({
	  domain: "google.com"
	});
	console.log(cookies2)
	const cookies3 = await chrome.cookies.getAll({
	  domain: ""
	});
	console.log(cookies3)
	const cookies4 = await chrome.cookies.getAll({
	  domain: ".fr"
	});
	console.log(cookies4)
	const cookies5 = await chrome.cookies.getAll({
	  domain: ".com"
	});
	console.log(cookies5)
	/*cookies.forEach(cookie => {
		console.log(cookie);
	})*/

	/*chrome.cookies.getAll({
	  domain: "<all_urls>"
	}, function (cookies) {
	  for (var i = 0; i < cookies.length; i++) {
	    console.log(cookies[i] + "found");
	  }
	});*/
});

// Opening dashboard on button click
document.querySelector("#popup-db-button").addEventListener("click", () => {

	console.log("button #popup-db-button clicked");
	chrome.tabs.create({ url: chrome.runtime.getURL("dashboard/index.html") });

});

// Opening "about" page on button click
document.querySelector("#popup-about").addEventListener("click", () => {

	console.log("button #popup-about clicked");
	chrome.tabs.create({ url: chrome.runtime.getURL("dashboard/about.html") });

});
