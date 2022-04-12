
document.getElementById("getCookies").addEventListener("click", async function(){
	console.log("Hello")
	//const cookieStorage = await chrome.cookies.getAllCookieStores();
	//console.log(cookieStorage);
	const cookies = await chrome.cookies.getAll({
	  domain: "<all_urls>"
	});
	console.log(cookies)
});

