import React, { useState, useEffect } from 'react'
import ScoreLineChart from './graphs/ScoreLineChart.js';
import CookieLineChart from './graphs/CookieLineChart.js';
import CookieHisto from './graphs/CookieHisto.js';
import WebsiteTable from './graphs/WebsiteTable.js';
import Zoom from '@mui/material/Zoom';
import "./dashboard.scss";

export default function Dashboard() {

    const zoomDuration = 300;
    const zoomOffset = 75;

    return (

        <div className="dashboard-wrapper">
            <Zoom in={true} style={{ transitionDelay: 0 * zoomOffset + 'ms' }} timeout={zoomDuration} >
                <div><ScoreLineChart /></div>
            </Zoom>
            <Zoom in={true} style={{ transitionDelay: 2 * zoomOffset + 'ms' }} timeout={zoomDuration} >
                <div><CookieLineChart /></div>
            </Zoom>
            <Zoom in={true} style={{ transitionDelay: 1 * zoomOffset + 'ms' }} timeout={zoomDuration} >
                <div><WebsiteTable /></div>
            </Zoom>
            <Zoom in={true} style={{ transitionDelay: 3 * zoomOffset + 'ms' }} timeout={zoomDuration}>
                <div><CookieHisto /></div>
            </Zoom>

        </div>

    )
}