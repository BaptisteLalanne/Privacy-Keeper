import React, { useState, useEffect } from 'react'
import ScoreLineChart from './graphs/ScoreLineChart.js';
import CookieLineChart from './graphs/CookieLineChart.js';
import CookieHistoAndPieChart from './graphs/CookieHistoAndPieChart.js';
import WebsiteTable from './graphs/WebsiteTable.js';
import Zoom from '@mui/material/Zoom';
import Grow from '@mui/material/Grow';
import "./dashboard.scss";

export default function Dashboard() {
    let [animationEnd, setAnimationEnd] = useState(false);
    const endZoom = (e) => {
        setAnimationEnd(true);
        console.log(animationEnd)
    }
    return (
        
        <div className="dashboard-wrapper">
            <Zoom in={true} style={{ transitionDelay: '0ms'}} timeout={300} >
                <div><ScoreLineChart/></div>
            </Zoom>
            <Zoom in={true} style={{ transitionDelay: '150ms'}} timeout={300} >
                <div><CookieLineChart/></div>
            </Zoom>
            <Zoom in={true} style={{ transitionDelay: '75ms'}} timeout={300} >
                <div><WebsiteTable/></div>
            </Zoom>
            <Zoom in={true} style={{ transitionDelay: '225ms'}} timeout={300} addEndListener={endZoom}>
                <div><CookieHistoAndPieChart/></div>
            </Zoom>
            
        </div>
        
    )
}
