/* Based on my understanding, this file is completely useless. -Marcus */

const messagesFromReactAppListener = (message, sender, response) => {
  console.log('[content.js]. Message received', {
      message,
      sender,
  })

  if (
      sender.id === chrome.runtime.id &&
      message.message === 'Hello from React') {
      response('Hello from content.js');
  }

}

//This class implements all methods to analyse trackers whithin a web page
const scripts = document.scripts;
console.log("Nb of scripts: " + scripts.length);

let nbBeacon = 0;
for (let i=0; i<scripts.length; i++) {
  if(scripts[i].src) {
    externalSourceLink = scripts[i].src;
    console.log(externalSourceLink);
    
  }
  const scriptContent = scripts[i].text;
  if(scriptContent.includes("sendBeacon")){
    console.log("FOUND Beacon!")
    nbBeacon ++;
  }
}
console.log("Nb of beacons found: " + nbBeacon);

chrome.runtime.sendMessage({function:'handleResultBeacon'}, function(response){
  console.log(response);  
})

/**
* Fired when a message is sent from either an extension process or a content script.
*/
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

