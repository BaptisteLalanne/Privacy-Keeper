import React, { useEffect, useState } from 'react';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import BuildIcon from '@mui/icons-material/Build';
import InsightsIcon from '@mui/icons-material/Insights';
import CampaignIcon from '@mui/icons-material/Campaign';
import { cookieTypeLabels } from '../../../scripts/miscellaneous/common.js'
import './popup.scss';

// Opening dashboard on button clicks
function clickIndex() {
  chrome.tabs.create({ url: chrome.runtime.getURL("options.html?page=dashboard") });
}
function clickAbout() {
  chrome.tabs.create({ url: chrome.runtime.getURL("options.html?page=learn-more") });
}

// Extract domain from URL
function extractDomain(fullUrl) {
  return fullUrl.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
}

// Mix colors
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    return [r, g, b];
  }
  return null;
}
function mixColors(colorA, colorB, amount) {
  let rgbA = hexToRgb(colorA);
  let rgbB = hexToRgb(colorB);
  let r = rgbA[0] * amount + rgbB[0] * (1 - amount);
  let g = rgbA[1] * amount + rgbB[1] * (1 - amount);
  let b = rgbA[2] * amount + rgbB[2] * (1 - amount);
  return "rgb(" + r + "," + g + "," + b + ")";
}

// Update CSS
function updateCSS(node, score, cookieScore, trackerScore) {

  // Vars
  let posColor = "#7DDE6D";
  let negColor = "#fd6500";
  let doc = node.ownerDocument;

  // Update cookie score color
  doc.getElementById("cookie-score").style.color = mixColors(negColor, posColor, cookieScore / 100);

  // Update tracker score color
  doc.getElementById("tracker-score").style.color = mixColors(negColor, posColor, trackerScore / 100);

  // Update global score (configure final keyframe)
  doc.documentElement.style.setProperty('--initial-wheel-color', (score <= 50) ? posColor : negColor);
  doc.documentElement.style.setProperty('--final-wheel-color', mixColors(negColor, posColor, score / 100));
  doc.documentElement.style.setProperty('--final-wheel-angle', 'rotate(' + score * 3.6 + 'deg)');

  // Add animation classes
  let animation = "animate-" + ((score <= 50) ? "small" : "big");
  doc.getElementsByClassName("left-side")[0].classList.add(animation);
  doc.getElementsByClassName("right-side")[0].classList.add(animation);
  doc.getElementsByClassName("pie")[0].classList.add(animation);

}

// Generate blank popup
function generateBlankPopup(node) {

  node.innerHTML = "Nothing to see here...";

}

/* global chrome */
function Popup() {

  let wrapperRef = React.useRef(null);

  const [url, setUrl] = useState('');
  const [isChromeTab, setIsChromeTab] = useState(false);
  let [score, setScore] = useState(100);
  let [cookieScore, setCookieScore] = useState(100);
  let [trackerScore, setTrackerScore] = useState(100);
  let [cookieDetails, setCookieDetails] = useState([0, 0, 0, 0]);

  const detailedCookiesIcons = [
    <ElectricBoltIcon />,
    <BuildIcon />,
    <InsightsIcon />,
    <CampaignIcon />
  ];

  // Main Hook
  useEffect(() => {

    // Fetch URL
    const queryInfo = { active: true, lastFocusedWindow: true };
    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
      setUrl(tabs[0].url);
      setIsChromeTab(tabs[0].url.split(":")[0].includes("chrome"));
    });

    // Fetch scores from storage
    cookieScore = "??";
    chrome.storage.sync.get(["fingerprintAnalyseResult"], function (result) {

      fingerprintAnalyseResult = Math.round(result.fingerprintAnalyseResult);
      console.log('[EXTENSION] Fingerprinter score : ' + result.fingerprintAnalyseResult);

      //score = Math.max(cookieScore, trackerScore);
      trackerScore = fingerprintAnalyseResult.final_score;
      console.log("trackerScore" + trackerScore);

      score = trackerScore;

      // Save score states
      setScore(score);
      setCookieScore(cookieScore);
      setTrackerScore(trackerScore);

      // Update CSS
      updateCSS(wrapperRef.current, score, cookieScore, trackerScore);

    });

    // Fetch cookie classificatins from storage
    chrome.storage.sync.get(['currentCookieTypes'], function (result) {
      let labels = result.currentCookieTypes;
      console.log(labels);
      setCookieDetails(labels);
    });

  }, []);

  // Handle click on collapsable items
  const [expanded, setExpanded] = useState('');
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <>
      <div className="wrapper" ref={wrapperRef}>

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
            {isChromeTab ? "Nothing to see here..." : (extractDomain(url) || "This website")}
          </div>

          <div className="horizontal-line"></div>

          {/* General score */}
          <div className="body-item card general-score-container" style={{ display: isChromeTab ? 'none' : 'flex' }}>

            {/* General score graphic (left side) */}
            <div className="general-score-left">

              {/* General score graphic label */}
              <div className="general-score-label">
                Privacy Risk
              </div>

              {/* General score graphic wheel */}
              <div className="score-graphic">

                <div className="pie-wrapper">
                  <span className="label" id="general-score">{score}<span className="smaller">%</span></span>
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
          <div className="body-item card detailed-scores" style={{ display: isChromeTab ? 'none' : 'flex' }}>

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
                  Cookie intrusiveness
                </div>

              </MuiAccordionSummary>

              {/* Content */}
              <MuiAccordionDetails className="detailed-score-contents">
                {[...Array(4)].map((x, i) =>
                  <div className="detailed-score-item" style={{ opacity: cookieDetails[i] > 0 ? 1 : 0.8 }}>
                    <div className="detailed-cookies-score-item-icon"> {detailedCookiesIcons[i]} </div>
                    <div className="detailed-cookies-score-item-text">
                      {cookieDetails[i] > 0 ? <div style={{ fontWeight: "bold" }}>{cookieDetails[i]}</div> : <></>}
                      <div>{(cookieDetails[i] == 0 ? "No " : "") + cookieTypeLabels[i].toLowerCase() + " cookie" + (cookieDetails[i] > 1 ? "s" : "")}</div>
                    </div>
                  </div>
                )}
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
                  Tracking suspicion
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