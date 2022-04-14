import React from 'react';
import "./dashboard.scss";
import Histogram from './Histogram.js';


function Dashboard() {
    return (
        <div className="main">
            <h1 className="title">Dashboard</h1>
            <Histogram />
        </div>
    )
}

export default Dashboard;