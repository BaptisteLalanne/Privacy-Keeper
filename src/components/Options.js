import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import SpeedIcon from '@mui/icons-material/Speed';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import Popup from './Popup.js';
import Foreground from './Foreground.js';
import "./options.scss";

function Options() {
    return (
        <Router>
            <div className="main-wrapper">

                {/* Navigation bar */}
                <div className="nav-bar">

                    {/* Title and logo */}
                    <div className="header">

                        <div className="logo">
                            <img src="../icons/icon_128.png"></img>
                        </div>

                        <div className="title">
                            Privacy Keeper
                        </div>

                    </div>

                    <Divider />

                    {/* Navigation items */}
                    <List>

                        <ListItem button key="Dashboard">
                            <div className="nav-icon"><SpeedIcon/></div>
                            <Link to="/" className="nav-item">Dashboard</Link>
                        </ListItem>
                        <ListItem button key="Learn more">
                            <div className="nav-icon"><MenuBookIcon/></div>
                            <Link to="/learn-more" className="nav-item">Learn more</Link>
                        </ListItem>
                        <ListItem button key="Controls">
                            <div className="nav-icon"><BuildIcon/></div>
                            <Link to="/controls" className="nav-item">Controls</Link>
                        </ListItem>
                        <ListItem button key="Settings">
                            <div className="nav-icon"><SettingsIcon/></div>
                            <Link to="/settings" className="nav-item">Settings</Link>
                        </ListItem>
                        <ListItem button key="About us">
                            <div className="nav-icon"><InfoIcon/></div>
                            <Link to="/about-us" className="nav-item">About us</Link>
                        </ListItem>

                    </List>

                </div>

                <Switch>
                    <Route exact path="/">
                        <Redirect to="/options.html" />
                    </Route>
                    <Route exact path="/learn-more">
                        <Redirect to="/options.html" />
                    </Route>
                    <Route exact path="/controls">
                        <Redirect to="/options.html" />
                    </Route>
                    <Route exact path="/settings">
                        <Redirect to="/options.html" />
                    </Route>
                    <Route exact path="/about-us">
                        <Redirect to="/options.html" />
                    </Route>
                </Switch>

            </div>
        </Router>
    )
}

export default Options;