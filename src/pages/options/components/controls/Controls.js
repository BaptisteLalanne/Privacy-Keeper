import React, { useState, useEffect } from 'react'
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import Input from '@mui/material/Input';
import Fade from '@mui/material/Fade';
import CookieTable from "./CookieTable.js";
import Whitelist from "./Whitelist.js";
import "./controls.scss";

// Update switch CSS
function updateSwitchCSS(switchNode) {

    // Update label opacity
    let associatedLabel = switchNode.parentNode.parentNode.nextSibling;
    associatedLabel.style.filter = switchNode.checked ? "none" : "grayscale(100%)";
    associatedLabel.style.opacity = switchNode.checked ? "1" : "0.8";

    // If there's an input field in the label, disable or enable it
    if (associatedLabel.childNodes.length > 1) {
        if (switchNode.checked) {
            associatedLabel.childNodes[1].firstChild.removeAttribute("disabled");
        }
        else {
            associatedLabel.childNodes[1].firstChild.setAttribute("disabled", "");
        }
    }

}

export default function Controls() {

    // Refs and states
    let expirationTimeInputRef = React.useRef(null);
    let [state, setState] = useState({
        autoDeleteOldCookies: false,
        blockTrackers: false,
        blockCookies: false,
    });

    // Retrieve settings from local storage
    useEffect(() => {

        // Retrieve option toggles
        let switchNodesList = document.getElementsByClassName("MuiSwitch-input");
        chrome.storage.local.get(["toggle_options"], function (res) {
            let savedState = res.toggle_options;
            // Update state
            setState(savedState);
            // Update CSS
            for (let i = 0; i < switchNodesList.length; i++) {
                updateSwitchCSS(switchNodesList[i]);
            }
        });

        // Retrieve expiration time
        chrome.storage.local.get(["expiration_time"], function (res) {
            let savedTime = res.expiration_time / (1000 * 60 * 60 * 24);
            // Update DOM (necessary because a state variable is not enough: defaultValue only loaded once, before this hook, so we need to set the actual DOM value)
            expirationTimeInputRef.current.firstChild.value = savedTime;
        });

    }, []);

    // Local settings updaters
    const saveExpirationTime = (newTime) => {
        chrome.storage.local.set({ "expiration_time": newTime * (1000 * 60 * 60 * 24) }, function () {
            if (chrome.runtime.error) {
            }
        });
    }
    const saveToggleOptions = (newState) => {
        chrome.storage.local.set({ "toggle_options": newState }, function () {
            if (chrome.runtime.error) {
            }
        });
    }

    // Change handlers
    const handleExpirationTimeChange = (event) => {
        let newTime = event.target.value;
        event.target.value = Math.max(newTime, 0);
    }
    const handleExpirationTimeUnfocus = (event) => {
        let newTime = event.target.value;
        // Update stored settings
        saveExpirationTime(newTime);
    }
    const handleToggleChange = (event) => {
        let newState = {
            ...state,
            [event.target.name]: event.target.checked,
        };
        // Update state
        setState(newState);
        // Update CSS
        updateSwitchCSS(event.target);
        // Update stored settings
        saveToggleOptions(newState);
    };

    const fadeDuration = 400;
    const fadeOffset = 200;

    return (
            <div className="controls-wrapper">

                {/* Toggle options*/}
                <Fade in={true} timeout={fadeDuration} style={{ transitionDelay: 50+0*fadeOffset+'ms' }}>
                <div className="controls-section">
                    <div className="controls-section-header">
                        <Divider textAlign="left">Toggle options</Divider>
                    </div>
                    <div className="controls-section-body">
                        <div className="toggle-options-body">

                            <div className="toggle-options-item">
                                <Switch checked={state.autoDeleteOldCookies} onChange={handleToggleChange} name="autoDeleteOldCookies" size="small" />
                                <div className="toggle-options-item-label">
                                    Delete cookies older than &nbsp;
                                    <Input id="expirationTimeInput" type="number" inputProps={{ min: 0 }}
                                        onChange={handleExpirationTimeChange} 
                                        onBlur={handleExpirationTimeUnfocus}
                                        ref={expirationTimeInputRef}
                                    />
                                    &nbsp; days each time the browser is launched
                                </div>
                            </div>

                            <div className="toggle-options-item">
                                <Switch checked={state.blockTrackers} onChange={handleToggleChange} name="blockTrackers" size="small" />
                                <div className="toggle-options-item-label">
                                    Cover my tracks and fingerprints as I navigate online
                                </div>
                            </div>

                            <div className="toggle-options-item">
                                <Switch checked={state.blockCookies} onChange={handleToggleChange} name="blockCookies" size="small" />
                                <div className="toggle-options-item-label">
                                    Automatically block third-party cookies
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </Fade>

                {/* Manage cookies */}
                <Fade in={true} timeout={fadeDuration} style={{ transitionDelay: 1*fadeOffset+'ms' }}>
                <div className="controls-section">
                    <div className="controls-section-header">
                        <Divider textAlign="left">Manage cookies</Divider>
                    </div>
                    <div className="controls-section-body">
                        <CookieTable/>
                    </div>
                </div>
                </Fade>

                {/* Manage whitelist */}
                <Fade in={true} timeout={fadeDuration} style={{ transitionDelay: 2*fadeOffset+'ms' }}>
                <div className="controls-section">
                    <div className="controls-section-header">
                        <Divider textAlign="left">Whitelisted websites</Divider>
                    </div>
                    <div className="controls-section-body">
                        <Whitelist/>
                    </div>
                </div>
                </Fade>

            </div>
    )
}