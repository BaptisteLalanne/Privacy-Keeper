import React, { useEffect, useState } from 'react';
import './popup.scss';
/*global chrome*/
function Popup() {

  const [url, setUrl] = useState('');
  const [responseFromContent, setResponseFromContent] = useState('');

  chrome.storage.sync.get(['beacons'], function(result) {
    console.log(result);
    console.log('[EXTENSION] beacons value is ' + result.beacons);
  });

  /**
   * Listen to chrome.runtime messages
   */
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log("[EXTENSION] received")
      if (request.function === "handleResultBeacon")
        sendResponse("Popup received message from handleResultBeacon");
    }
  );


  /**
   * Send message to the content script
   */
  const sendTestMessage = () => {
    const message = {
      message: "Hello from React",
    }

    const queryInfo = {
      active: true,
      currentWindow: true
    };

    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
      const currentTabId = tabs[0].id;
      /**
       * Sends a single message to the content script(s) in the specified tab,
       * with an optional callback to run when a response is sent back.
       *
       * The runtime.onMessage event is fired in each content script running
       * in the specified tab for the current extension.
       */
      chrome.tabs.sendMessage(
        currentTabId,
        message,
        (response) => {
          setResponseFromContent(response);
        });
    });
  };


  /**
   * Get current URL
   * UseEffect is a hook, ask BaptisteLalanne
   */
  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };

    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
      const url = tabs[0].url;
      setUrl(url);
    });
  }, []);


  // Opening dashboard on button click
  const clickIndex = () => {
    console.log("button #popup-db-button clicked");
    chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });

  };

  const clickAbout = () => {

    console.log("button #popup-about clicked");
    chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });

  };


  return <div className="app">
    <p>URL:</p>
    <p>
      {url}
    </p>
    <div id="counter" className="counter"></div>
    <div className="button-container">
      <button id="decrementBtn" className="button" onClick={clickIndex}>Index</button>
      <button id="incrementBtn" className="button" onClick={clickAbout}>About</button>
      <button onClick={sendTestMessage}>SEND MESSAGE</button>
    </div>

    <hr className="divider" />
    <p>Response from content:</p>
    <p>
      {responseFromContent}
    </p>
    <p className="title">Chrome Extension is Ready!</p>
    <p className="subtitle">Start by updating <code>popup.html</code></p>
  </div>
    ;
}

export default Popup;
