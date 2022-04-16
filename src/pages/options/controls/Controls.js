import React, { useState, useEffect } from 'react'
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';

// To update the experation time stored in local
function updateExpirationTime() {
    let dateInput = document.getElementById("dateInput").value;
    chrome.storage.local.set({ "expiration_time": dateInput * 1000 * 60 * 60 * 24 }, function () {
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        } else {
            console.log("updated");
        }
    });
}

export default function Controls() {

    let [state, setState] = useState({
        autoDeleteOldCookies: true,
        blockTrackers: false,
        blockCookies: false,
    });
    let [expirationTime, setExpirationTime] = useState(687);
    let [input, setInput] = useState();

    // Retrieve expiration time from local storage
    useEffect(() => {
        chrome.storage.local.get("expiration_time", function (res) {
            setExpirationTime(res["expiration_time"] / 86400000);
        });
    }, [setExpirationTime]);
    
    const handleToggleChange = (event) => {
        setState({
          ...state,
          [event.target.name]: event.target.checked,
        });
    };

    const handleDateInputChange = (event) => {
        setInput({ value: event.target.value });
    }

    return (
        <div>

            {/* Toggle options*/}
            <div className="controls-section">
                <div className="controls-section-header">
                    Toggle options
                </div>
                <div className="controls-section-body">
                    <FormControl component="fieldset" variant="standard">
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch checked={state.autoDeleteOldCookies} onChange={handleToggleChange} name="autoDeleteOldCookies" />
                                }
                                label={
                                    <div className="toggle-options-item-label">
                                        Delete cookies older than 
                                        <input id="dateInput" type="number" defaultValue={input} placeholder={expirationTime} onChange={handleDateInputChange} onBlur={updateExpirationTime} />
                                        days each time the browser is launched
                                    </div>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Switch checked={state.blockTrackers} onChange={handleToggleChange} name="blockTrackers" />
                                }
                                label={
                                    <div className="toggle-options-item-label">
                                        Cover my tracks and fingerprints as I navigate online
                                    </div>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Switch checked={state.blockCookies} onChange={handleToggleChange} name="blockCookies" />
                                }
                                label={
                                    <div className="toggle-options-item-label">
                                        Automatically block third-party cookies
                                    </div>
                                }
                            />
                        </FormGroup>
                    </FormControl>
                </div>
            </div>

            {/* Manage cookies */}
            <div className="controls-section">
                <div className="controls-section-header">
                    Manage cookies
                </div>
                <div className="controls-section-body">

                </div>
            </div>

        </div>
    )
}