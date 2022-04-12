'use strict';

import './popup.css';

(function() {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  const counterStorage = {
    get: cb => {
      chrome.storage.sync.get(['count'], result => {
        cb(result.count);
      });
    },
    set: (value, cb) => {
      chrome.storage.sync.set(
        {
          count: value,
        },
        () => {
          cb();
        }
      );
    },
  };

  function setupCounter(initialValue = 0) {
    document.getElementById('counter').innerHTML = initialValue;

    document.getElementById('incrementBtn').addEventListener('click', () => {
      updateCounter({
        type: 'INCREMENT',
      });
    });

    document.getElementById('decrementBtn').addEventListener('click', () => {
      updateCounter({
        type: 'DECREMENT',
      });
    });
  }

  function updateCounter({ type }) {
    counterStorage.get(count => {
      let newCount;

      if (type === 'INCREMENT') {
        newCount = count + 1;
      } else if (type === 'DECREMENT') {
        newCount = count - 1;
      } else {
        newCount = count;
      }

      counterStorage.set(newCount, () => {
        document.getElementById('counter').innerHTML = newCount;

        // Communicate with content script of
        // active tab by sending a message
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          const tab = tabs[0];

          chrome.tabs.sendMessage(
            tab.id,
            {
              type: 'COUNT',
              payload: {
                count: newCount,
              },
            },
            response => {
              console.log('Current count value passed to contentScript file');
            }
          );
        });
      });
    });
  }

  function restoreCounter() {
    // Restore count value
    counterStorage.get(count => {
      if (typeof count === 'undefined') {
        // Set counter value as 0
        counterStorage.set(0, () => {
          setupCounter(0);
        });
      } else {
        setupCounter(count);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', restoreCounter);

  // Communicate with background file by sending a message
  chrome.runtime.sendMessage(
    {
      type: 'GREETINGS',
      payload: {
        message: 'Hello, my name is Pop. I am from Popup.',
      },
    },
    response => {
      console.log(response.message);
    }
  );
})();



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
