import React, { useEffect, useState } from 'react';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import style from './popup.scss';

/* global chrome */
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

  // Get current URL (UseEffect is a hook, ask BaptisteLalanne)
  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };
    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
      const url = tabs[0].url;
      setUrl(url);
      // Update CSS
      const root = document.documentElement;
      root?.style.setProperty("--score", score);
      root?.style.setProperty("--cookieScore", cookieScore);
      root?.style.setProperty("--trackerScore", trackerScore);
    });
  }, []);

  // Handle click on collapsable items
  const [expanded, setExpanded] = React.useState('panel1');
  const handleChange =
    (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
    };

  // Opening dashboard on button clicks
  const clickIndex = () => {
    console.log("button #popup-db-button clicked");
    chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
  };
  const clickAbout = () => {
    console.log("button #popup-about clicked");
    chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
  };

  // Extract domain from URL
  function extractDomain(fullUrl) {
    return url.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
  }

  // Compute scores
  let score = 60;
  let cookieScore = 90;
  let trackerScore = 30;

  

  return (
    <>
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

                <div className="pie-wrapper">
                  <span className="label">{score}<span className="smaller">%</span></span>
                  <div className="pie">
                    <div className="left-side half-circle"></div>
                    <div className="right-side half-circle"></div>
                  </div>
                  <div className="shadow"></div>
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
            <MuiAccordion disableGutters elevation={0} expanded={expanded === 'cookieScoreAccordion'} onChange={handleChange('cookieScoreAccordion')}>

              {/* Header */}
              <MuiAccordionSummary expandIcon={<i className="bi bi-chevron-down"></i>} aria-controls="cookieScoreAccordion-content" id="cookieScoreAccordion-header">

                {/* Cookie score graphic (left side) */}
                <div className="detailed-score-header-graphic">
                  <span className="label" id="cookie-score">{cookieScore}<span className="smaller">%</span></span>
                </div>

                {/* Cookie score label */}
                <div className="detailed-score-header-label">
                  Cookie score
                </div>

              </MuiAccordionSummary>

              {/* Content */}
              <MuiAccordionDetails className="detailed-score-contents">
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                  sit amet blandit leo lobortis eget.
                </Typography>
              </MuiAccordionDetails>

            </MuiAccordion>

            {/* Tracker score */}
            <MuiAccordion disableGutters elevation={0} expanded={expanded === 'trackerScoreAccordion'} onChange={handleChange('trackerScoreAccordion')}>

              {/* Header */}
              <MuiAccordionSummary expandIcon={<i className="bi bi-chevron-down"></i>} aria-controls="trackerScoreAccordion-content" id="trackerScoreAccordion-header">

                {/* Tracker score graphic (left side) */}
                <div className="detailed-score-header-graphic">
                  <span className="label" id="tracker-score">{trackerScore}<span className="smaller">%</span></span>
                </div>

                {/* Tracker score label */}
                <div className="detailed-score-header-label">
                  Tracker score
                </div>

              </MuiAccordionSummary>

              {/* Content */}
              <MuiAccordionDetails>
                <Typography className="detailed-score-contents">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                  sit amet blandit leo lobortis eget.
                </Typography>
              </MuiAccordionDetails>

            </MuiAccordion>

          </div>

        </div>

      </div>
    </>
  );
}

export default Popup;