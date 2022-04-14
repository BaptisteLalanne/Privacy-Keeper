import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import "./options.scss";
import Popup from './Popup.js';
import Dashboard from './Dashboard.js';

function Options() {
    return (
        <Router>
            <div className="main-wrapper">

                {/* Navigation bar */}
                <div className="nav-bar">

                    {/* Title and logo */}
                    <div className="header">

                        <div className="logo">
                            <img src="../icons/icon_48.png"></img>
                        </div>

                        <div className="title">
                            Privacy Keeper
                        </div>

                    </div>

                    <div className="horizontal-line"></div>

                    {/* Navigation items */}
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Options</Link>
                            </li>
                            <li>
                                <Link to="/popup">Popup</Link>
                            </li>
                            <li>
                                <Link to="/dashboard">Dashboard</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <Switch>
                    <Route exact path="/popup">
                        <Popup />
                    </Route>
                    <Route exact path="/dashboard">
                        <Dashboard />
                    </Route>
                    <Route exact path="/">
                        <Redirect to="/options.html" />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default Options;