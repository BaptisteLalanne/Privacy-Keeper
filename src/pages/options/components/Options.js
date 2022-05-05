import React, { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import SpeedIcon from '@mui/icons-material/Speed';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BuildIcon from '@mui/icons-material/Build';
import InfoIcon from '@mui/icons-material/Info';
import Dashboard from './dashboard/Dashboard';
import LearnMore from './learnMore/LearnMore';
import Controls from './controls/Controls.js';
import AboutUs from './aboutUs/AboutUs';
import style from "./options.scss";

function urlify(label) {
    return label.replace(/\s+/g, '-').toLowerCase();
}

export default function Options() {

    let [currentComponent, setCurrentComponent] = useState(0);
    let [cookieTypes, setCookieTypes] = useState({});

    const itemRefs = [React.useRef(null), React.useRef(null), React.useRef(null), React.useRef(null)];
    const itemList = [
        { "name": "Dashboard", "icon": <SpeedIcon />, "component": <Dashboard /> },
        { "name": "Learn more", "icon": <MenuBookIcon />, "component": <LearnMore /> },
        { "name": "Controls", "icon": <BuildIcon />, "component": <Controls /> },
        { "name": "About us", "icon": <InfoIcon />, "component": <AboutUs /> }
    ];

    useEffect(() => {

        // Redirect to appropriate page based on window param
        let param = window.location.search.substring(1).split('=');
        const currentPage = param[1];
        if (currentPage != null) {
            for (let i = 0; i < itemList.length; i++) {
                if (currentPage == urlify(itemList[i].name)) {
                    clickItem(i);
                    break;
                }
            }
        }

    }, []);

    const clickItem = (index) => {

        // Set current component index
        setCurrentComponent(index);

        // Update window param
        window.history.replaceState(null, null, "?page=" + urlify(itemList[index].name));

        // Update item CSS
        for (let i = 0; i < itemList.length; i++) {
            itemRefs[i].current.getElementsByClassName("nav-icon")[0].style.color = style.darkgrey;
            itemRefs[i].current.setAttribute('style', 'font-weight: normal');
            itemRefs[i].current.style.color = "black";
        }
        itemRefs[index].current.getElementsByClassName("nav-icon")[0].style.color = style.logocol0;
        itemRefs[index].current.setAttribute('style', 'font-weight: bold');
        itemRefs[index].current.style.color = style.logocol0;

    };

    return (
        <div className="main-wrapper">

            {/* Navigation bar */}
            <div className="nav-wrapper">
                <div className="nav-bar">

                    {/* Title and logo */}
                    <div className="header">
                        <div className="logo"><img src="icon_banner.png"></img></div>
                    </div>

                    <Divider />

                    {/* Navigation items */}
                    <List>
                        {
                            itemList.map((item, index) => (
                                <ListItem button key={item.name} onClick={() => { clickItem(index); }} ref={itemRefs[index]} className="nav-item">
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
