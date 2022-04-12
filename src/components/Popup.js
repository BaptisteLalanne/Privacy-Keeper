import React, { useEffect, useState } from 'react';
import './popup.scss';

/*global chrome*/
function Popup() {

  const [url, setUrl] = useState('');
  const [responseFromContent, setResponseFromContent] = useState('');

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

  function extractDomain(fullUrl) {
    return url.replace('http://', '').replace('https://','').split(/[/?#]/)[0];
  }

  // Compute scores
  let score = 60;
  const root = document.documentElement;
  root?.style.setProperty("$percent", score);

  return (
    <div className="wrapper">

      {/* Top banner */}
      <div className="top-component">
        <div className="top-item" onClick={clickAbout}>
          <i className="bi bi-info-circle"></i>
        </div>
        <div className="top-item" onClick={clickIndex}>
          <i className="bi bi-gear"></i>
        </div>
      </div>

      {/* Popup body */}
      <div className="body-component">

        {/* Name of website */}
        <div className="body-item" id="website-title">
          {extractDomain(url)}
        </div>

        <div className="horizontal-line"></div>

        {/* General score */}
        <div className="body-item card general-score">

          {/* General score graphic (left side) */}
          <div className="general-score-left">

            {/* General score graphic label */}
            <div className="general-score-label">
              Privacy Score
            </div>

            {/* General score graphic wheel */}
            <div className="score-graphic">

              <div class="pie-wrapper">
                <span class="label">{score}<span class="smaller">%</span></span>
                <div class="pie">
                  <div class="left-side half-circle"></div>
                  <div class="right-side half-circle"></div>
                </div>
                <div class="shadow"></div>
              </div>

            </div>

          </div>

          {/* General score explanation (right side) */}
          <div className="general-score-right">
            This website has some hardware trackers.
          </div>

        </div>

        {/* Detailed scores */}
        <div className="body-item card detailed-scores">

          {/* Cookie score */}
          <div className="detailed-score-item">

            {/* Cookie score graphic wheel (left side) */}
            <div className="detailed-score-item-left">
              <div className="score-graphic">
                <div id="cookie-score">
                  90%
                </div>
              </div>
            </div>

            {/* Cookie score description (right side) */}
            <div className="detailed-score-item-right">

              {/* Cookie score title (label + arrow) */}
              <div className="detailed-score-item-right-top">
                <div className="detailed-score-label">
                  Cookie score
                </div>
                <i className="bi bi-chevron-down"></i>
              </div>

              {/* Cookie score details (hidden at first) */}
              <div className="detailed-score-item-right-details">

              </div>

            </div>
          </div>

          {/* Tracker score */}
          <div className="detailed-score-item">

            {/* Tracker score graphic wheel (left side) */}
            <div className="detailed-score-item-left">
              <div className="score-graphic">
                <div id="tracker-score">
                  40%
                </div>
              </div>
            </div>

            {/* Cookie score description (right side) */}
            <div className="detailed-score-item-right">

              {/* Tracker score title (label + arrow) */}
              <div className="detailed-score-item-right-top">
                <div className="detailed-score-label">
                  Tracker score
                </div>
                <i className="bi bi-chevron-down"></i>
              </div>

              {/* Tracker score details (hidden at first) */}
              <div className="detailed-score-item-right-details">

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
    );
}

export default Popup;
