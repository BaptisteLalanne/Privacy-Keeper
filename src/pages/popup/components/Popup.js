import React, { useEffect, useState } from 'react';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import BuildIcon from '@mui/icons-material/Build';
import InsightsIcon from '@mui/icons-material/Insights';
import CampaignIcon from '@mui/icons-material/Campaign';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
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

function Popup() {

  let wrapperRef = React.useRef(null);

  const [url, setUrl] = useState('');
  const [isChromeTab, setIsChromeTab] = useState(false);
  const [isInWhitelist, setIsInWhitelist] = useState(false);
  let [score, setScore] = useState(100);
  let [cookieScore, setCookieScore] = useState(0);
  let [trackerScore, setTrackerScore] = useState(0);
  let [cookieDetails, setCookieDetails] = useState([0, 0, 0, 0]);
  let [trackerScoreDescription, setTrackerScoreDescription] = useState("This is how much we suspect this website tracks you.");
  let [generalScoreDescription, setGeneralScoreDescription] = useState("This website has some hardware trackers.");
  let [blocksCookies, setBlocksCookies] = useState(false);

  const detailedCookiesIcons = [
    <ElectricBoltIcon />,
    <BuildIcon />,
    <InsightsIcon />,
    <CampaignIcon />
  ];

  const detailedCookiesExplanations = [
    "These cookies are necessary for the site to run correctly",
    "These cookies are used for certain functionalities of the site",
    "These cookies are used to gather analytics about who visits the website and what they do on it",
    "These cookies are used to gather information about your personal preferences in order to tailor displayed ads"
  ];

  // Main Hook
  useEffect(() => {

    // Fetch URL
    const queryInfo = { active: true, lastFocusedWindow: true };
    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
      setUrl(tabs[0].url);
      setIsChromeTab(tabs[0].url.split(":")[0].includes("chrome"));

      // Check if it's in whitelist
      let domain = extractDomain(tabs[0].url);
      chrome.storage.local.get("whitelist", function (result) {
        let whitelist = [];
        if (result && result.whitelist) {
          whitelist = result.whitelist
        }
        setIsInWhitelist(whitelist.includes(domain));
      });

    });

    // Fetch scores from storage
    chrome.storage.local.get(['cookieScore'], function (cookieScoreRes) {
      let cookieScore = cookieScoreRes.cookieScore;

      chrome.storage.local.get(['fingerprintAnalyseResult'], function (fingerprintScoreRes) {
        let trackerScore = fingerprintScoreRes.fingerprintAnalyseResult.final_score;
        const fp_extern = fingerprintScoreRes.fingerprintAnalyseResult.fp_extern;
        const fp_page = fingerprintScoreRes.fingerprintAnalyseResult.fp_page;

        let rounding = 5;
        cookieScore = Math.ceil(cookieScore / rounding) * rounding;
        if (isNaN(cookieScore))
          cookieScore = "??"
        trackerScore = Math.round(trackerScore / rounding) * rounding;
        if (isNaN(trackerScore))
          cookieScore = "??"
        score = Math.ceil((cookieScore + trackerScore) / 2);
        if (isNaN(score))
          score = "??"

        // Save score states
        setScore(score);
        setCookieScore(cookieScore);
        setTrackerScore(trackerScore);

        // Generate and set the description sentences
        generateDescriptionSentences(cookieScore, trackerScore, fp_extern, fp_page, score);

        // Update CSS
        updateCSS(wrapperRef.current, score, cookieScore, trackerScore);

      });
    });

    // Fetch cookie classificatins from storage
    chrome.storage.local.get(['currentCookieTypes'], function (result) {
      let labels = result.currentCookieTypes;
      console.log(labels);
      setCookieDetails(labels);
    });

    // Fetch options from storage
    chrome.storage.local.get("toggle_options", async function (result) {
      if (result && result.toggle_options) {
        setBlocksCookies(result.toggle_options.blockCookies);
      }
    });

  }, []);

  const toggleWhitelist = (url) => {
    let domain = extractDomain(url);
    chrome.storage.local.get("whitelist", function (result) {
      let whitelist = [];
      if (result && result.whitelist) {
        whitelist = result.whitelist
      }
      // Add to whitelist
      if (!isInWhitelist) {
        whitelist.push(domain);
        chrome.storage.local.set({ "whitelist": whitelist });
        setIsInWhitelist(true);
      }
      // Remove from whitelist
      else {
        const index = whitelist.indexOf(domain);
        if (index > -1) {
          whitelist.splice(index, 1);
        }
        chrome.storage.local.set({ "whitelist": whitelist });
        setIsInWhitelist(false);
      }
    });
  }

  // Generate and set the description sentences
  const generateDescriptionSentences = (cookieScore, trackerScore, fp_extern, fp_page, score) => {

    let trackerScoreDescription = "";
    // Tracker score description
    if (trackerScore < 25) {
      trackerScoreDescription = "This website doesn't seem to track your fingerprints";
    }
    else if (trackerScore < 45) {
      trackerScoreDescription = "This website most likely does not track your fingerprints";
    }
    else if (trackerScore < 70) {
      trackerScoreDescription = "This website is likely tracking your fingerprints";
    }
    else if (trackerScore < 90) {
      trackerScoreDescription = "This website is very likely tracking your fingerprints";
    }
    else {
      trackerScoreDescription = "This website is certainly tracking your fingerprints";
    }

    if (fp_extern > 100) {
      trackerScoreDescription += " using third party services";
    }
    trackerScoreDescription += ".";
    setTrackerScoreDescription(trackerScoreDescription);

    // General description
    // If nothing, "This website seems harmless"
    // If cookie score ++, "This website uses cookies [somewhat / very] intrusively,"
    // If tracker score ++, "This website has [some / many] trackers"
    // If one of the scores is high or if both scores are medium, "Be careful!"
    let cookieTier = (cookieScore >= 45) + (cookieScore >= 70);
    let trackerTier = (trackerScore >= 35) + (trackerScore >= 60);
    let generalDesc = "";
    if (cookieTier > 0 && trackerTier > 0) {
      generalDesc = "This website uses cookies " + ((cookieTier > 1) ? "very" : "somewhat") + " intrusively, and " + ((trackerTier > 1) ? "probably" : "likely") + " has trackers.";
    }
    else if (trackerTier > 0) {
      generalDesc = "This website " + ((trackerTier > 1) ? "probably" : "likely") + " has trackers.";
    }
    else if (cookieTier > 0) {
      generalDesc = "This website uses cookies " + ((cookieTier > 1) ? "very" : "somewhat") + " intrusively."
    }
    else {
      generalDesc = "This website seems harmless."
    }
    if (cookieTier == 2 || trackerTier == 2 || (cookieTier > 0 && trackerTier > 0)) {
      generalDesc += " Be careful!";
    }
    setGeneralScoreDescription(generalDesc);

  }

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
          <div className="top-item" onClick={() => toggleWhitelist(url)}>
            <Tooltip title={isInWhitelist ? <Typography fontSize={16}>This website was marked as safe</Typography> : <Typography fontSize={16}>Mark this website as safe</Typography>}>
              {isInWhitelist ? <i className="bi bi-check-circle-fill"></i> : <i className="bi bi-check-circle"></i>}
            </Tooltip>
          </div>
          <div className="top-item" onClick={clickAbout}>
            <Tooltip title={<Typography fontSize={16}>Learn more</Typography>}>
              <i className="bi bi-info-circle"></i>
            </Tooltip>
          </div>
          <div className="top-item" onClick={clickIndex}>
            <Tooltip style={{ fontSize: "16px" }} title={<Typography fontSize={16}>Dashboard and settings</Typography>}>
              <i className="bi bi-gear"></i>
            </Tooltip>
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
              {generalScoreDescription}
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
                  <div className="detailed-score-item" key={i}>
                    <div className="detailed-cookies-score-item" style={{ opacity: ((blocksCookies && !isInWhitelist && i > 1) || cookieDetails[i] == 0) ? 0.7 : 1 }}>
                      <div className="detailed-cookies-score-item-icon">
                        {detailedCookiesIcons[i]}
                      </div>
                      <div className="detailed-cookies-score-item-text">
                        {cookieDetails[i] > 0 ? <div style={{ fontWeight: "bold" }}>{cookieDetails[i]}</div> : <></>}
                        <div>{((blocksCookies && !isInWhitelist && i > 1 && cookieDetails[i] > 0) ? "blocked " : (cookieDetails[i] == 0 ? "No " : "")) + cookieTypeLabels[i].toLowerCase() + " cookie" + (cookieDetails[i] == 1 ? "" : "s")}</div>
                      </div>
                    </div>
                    <div>
                      <Tooltip title={<Typography fontSize={16}>{detailedCookiesExplanations[i]}</Typography>}>
                        <IconButton className="detailed-cookies-score-item-help-icon" size="small" onClick={clickAbout}> <HelpOutlineIcon /> </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                )}
              </MuiAccordionDetails>

            </MuiAccordion>

            {/* Tracker score */}
            < MuiAccordion disableGutters elevation={0} expanded={expanded === 'trackerScoreAccordion'} onChange={handleChange('trackerScoreAccordion')}>

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
                <span>
                  {trackerScoreDescription}
                  <Tooltip style={{ fontSize: "16px" }} title={<Typography fontSize={16}>Fingerprints are little bits of information you leave online (such as your computer specs or your browser configuration). Thanks to these, websites can easily identify you as a unique individual.</Typography>}>
                    <IconButton className="detailed-tracker-score-item-help-icon" size="small" onClick={clickAbout}> <HelpOutlineIcon /> </IconButton>
                  </Tooltip>
                </span>
              </MuiAccordionDetails>

            </MuiAccordion>

          </div>

        </div>

      </div>
    </>
  );
}

export default Popup;