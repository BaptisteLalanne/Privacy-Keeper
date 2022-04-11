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