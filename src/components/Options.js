import React, { useEffect, useState } from 'react';
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

    const itemList = [
        "Dashboard",
        "Learn more",
        "Controls",
        "Settings",
        "About us"
    ]

    let [currentComponent, setCurrentComponent] = useState(0);

    return (
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

                    <ListItem button key={itemList[0]} onClick={() => {setCurrentComponent(0);}}>
                        <div className="nav-icon"><SpeedIcon/></div>
                        {itemList[0]}
                    </ListItem>
                    <ListItem button key={itemList[1]} onClick={() => {setCurrentComponent(1);}}>
                        <div className="nav-icon"><MenuBookIcon/></div>
                        {itemList[1]}
                    </ListItem>
                    <ListItem button key={itemList[2]} onClick={() => {setCurrentComponent(2);}}>
                        <div className="nav-icon"><BuildIcon/></div>
                        {itemList[2]}
                    </ListItem>
                    <ListItem button key={itemList[3]} onClick={() => {setCurrentComponent(3);}}>
                        <div className="nav-icon"><SettingsIcon/></div>
                        {itemList[3]}
                    </ListItem>
                    <ListItem button key={itemList[4]} onClick={() => {setCurrentComponent(4);}}>
                        <div className="nav-icon"><InfoIcon/></div>
                        {itemList[4]}
                    </ListItem>

                </List>

            </div>

            <div className="content-wrapper">

                <div className="content-header">
                    <div className="content-header-title">
                        {itemList[currentComponent]}
                    </div>
                </div>
                
                <div className="content-body">
                    
                </div>

            </div>

        </div>
    )
}

export default Options;