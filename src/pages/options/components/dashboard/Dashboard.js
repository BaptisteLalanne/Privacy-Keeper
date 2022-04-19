import React from 'react';
import ScoreLineChart from './graphs/ScoreLineChart.js';
import CookieLineChart from './graphs/CookieLineChart.js';
import CookieHistoAndPieChart from './graphs/CookieHistoAndPieChart.js';
import WebsiteTable from './graphs/WebsiteTable.js';
import Zoom from '@mui/material/Zoom';
import "./dashboard.scss";

export default function Dashboard() {
    return (
        <div className="dashboard-wrapper">
            <Zoom in={true} style={{ transitionDelay: '0ms'}} timeout={500}>
                <div><ScoreLineChart/></div>
            </Zoom>
            <Zoom in={true} style={{ transitionDelay: '150ms'}} timeout={500}>
                <div><CookieLineChart/></div>
            </Zoom>
            <Zoom in={true} style={{ transitionDelay: '75ms'}} timeout={500}>
                <div><WebsiteTable/></div>
            </Zoom>
            <Zoom in={true} style={{ transitionDelay: '225ms'}} timeout={500}>
                <div><CookieHistoAndPieChart/></div>
            </Zoom>
        </div>
    )
}
