import React, { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import SpeedIcon from '@mui/icons-material/Speed';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import Dashboard from './dashboard/Dashboard';
import LearnMore from './learnMore/LearnMore';
import Controls from './controls/Controls.js';
import Settings from './controls/Settings';
import AboutUs from './aboutUs/AboutUs';
import style from "./options.scss";

function urlify(label) {
    return label.replace(/\s+/g, '-').toLowerCase();
}

export default function Options() {

    const itemList = [
        {"name": "Dashboard",       "icon": <SpeedIcon/>,       "component": <Dashboard/>},
        {"name": "Learn more",      "icon": <MenuBookIcon/>,    "component": <LearnMore/>}, 
        {"name": "Controls",        "icon": <BuildIcon/>,       "component": <Controls/>}, 
        {"name": "Settings",        "icon": <SettingsIcon/>,    "component": <Settings/>}, 
        {"name": "About us",        "icon": <InfoIcon/>,        "component": <AboutUs/>}
    ];

    const itemRefs = [React.useRef(null), React.useRef(null), React.useRef(null), React.useRef(null), React.useRef(null)];

    let [currentComponent, setCurrentComponent] = useState(0);
    
    useEffect(() => {

        // Redirect to appropriate page based on window param
        let param = window.location.search.substring(1).split('=');
        const currentPage = param[1];
        if (currentPage != null) {
            for (let i = 0; i < itemList.length; i++) {
                if (currentPage == urlify(itemList[i].name)) {
                    if (currentComponent != i) setCurrentComponent(i);
                    break;
                }
            }
        }

    }, []);

    const clickItem = (index) => {

        // Set current component index
        setCurrentComponent(index);

        // Update window param
        window.history.replaceState(null, null, "?page="+urlify(itemList[index].name));

        // Update item CSS
        /*
        for (let i = 0; i < itemList.length; i++) {
            itemRefs[i].current.style.color = "black";
        }
        itemRefs[index].current.style.color = style.col2;
        */

    };

    return (
        <div className="main-wrapper">

            {/* Navigation bar */}
            <div className="nav-wrapper">
                <div className="nav-bar">

                    {/* Title and logo */}
                    <div className="header">
                        <div className="logo"><img src="icon_128.png"></img></div>
                        <div className="title">Privacy Keeper</div>
                    </div>

                    <Divider />

                    {/* Navigation items */}
                    <List>
                    {
                        itemList.map((item, index) => (
                            <ListItem button key={item.name} onClick={() => { clickItem(index); }} ref={itemRefs[index]}>
                                <div className="nav-icon">{item.icon}</div>
                                {item.name}
                            </ListItem>
                        ))
                    }
                    </List>

                </div>
            </div>

            {/* Page */}
            <div className="content-wrapper">


                 {/* Page header */}
                <div className="content-header">
                    <div className="content-header-title">
                        {itemList[currentComponent].name}
                    </div>
                </div>
                
                 {/* Page body */}
                <div className="content-body">
                    <div>{itemList[currentComponent].component}</div>
                </div>

            </div>

        </div>
    )
}