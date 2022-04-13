import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import './popup.scss';

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

  // Collapsable items
  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }));
  
  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));
  
  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }));
  
  // Get current URL (UseEffect is a hook, ask BaptisteLalanne)
  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };

    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
      const url = tabs[0].url;
      setUrl(url);
    });
  }, []);

  // Handle click on collapsable items
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
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
          <Accordion expanded={expanded === 'cookieScoreAccordion'} onChange={handleChange('cookieScoreAccordion')}>
            
            {/* Header */}
            <AccordionSummary aria-controls="cookieScoreAccordion-content" id="cookieScoreAccordion-header" className="detailed-score-header">

              {/* Cookie score graphic wheel (left side) */}
              <div className="detailed-score-header-graphic">
                <div className="score-graphic">
                  <div id="cookie-score">
                    90%
                  </div>
                </div>
              </div>

              {/* Cookie score label */}
              <div className="detailed-score-header-label">
                  Cookie score
              </div>

            </AccordionSummary>

            {/* Content */}
            <AccordionDetails className="detailed-score-contents">
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                sit amet blandit leo lobortis eget.
              </Typography>
            </AccordionDetails>

          </Accordion>

          {/* Tracker score */}
          <Accordion expanded={expanded === 'trackerScoreAccordion'} onChange={handleChange('trackerScoreAccordion')}>

            {/* Header */}
            <AccordionSummary aria-controls="trackerScoreAccordion-content" id="trackerScoreAccordion-header" className="detailed-score-header">
              
              {/* Tracker score graphic wheel (left side) */}
              <div className="detailed-score-header-graphic">
                <div className="score-graphic">
                  <div id="tracker-score">
                    30%
                  </div>
                </div>
              </div>

              {/* Tracker score label */}
              <div className="detailed-score-header-label">
                  Tracker score
              </div>

            </AccordionSummary>

            <AccordionDetails>
              <Typography className="detailed-score-contents">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                sit amet blandit leo lobortis eget.
              </Typography>
            </AccordionDetails>

          </Accordion>

        </div>

      </div>

    </div>
    );
}

export default Popup;


export function CustomizedAccordions() {
  

  return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>Collapsible Group Item #1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
            sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Collapsible Group Item #2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
            sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>Collapsible Group Item #3</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
            sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
