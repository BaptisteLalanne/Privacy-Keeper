chrome.windows.onCreated.addListener(function() {
    chrome.windows.getAll(function(windows) {
        if (windows.length == 1) {
            console.log("open");
        }
    });
});

document.getElementById("getCookies").addEventListener("click", async function(){
	console.log("Hello")
	//const cookieStorage = await chrome.cookies.getAllCookieStores();
	//console.log(cookieStorage);
	const cookies = await chrome.cookies.getAll({
	  domain: "<all_urls>"
	});
	console.log(cookies)
});
