import React from 'react';
import "./dashboard.scss";
import Histogram from './Histogram.js';


function Dashboard() {
    return (
        <div className="main-wrapper">
            <h1 className="title">Dashboard</h1>
            <div id="histogram"></div>
        </div>
    )
}

export default Dashboard;