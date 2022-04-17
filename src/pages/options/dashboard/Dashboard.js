import React from 'react';
import Histogram from './Histogram.js';
import "./dashboard.scss";

export default function Dashboard() {
    return (
        <div className="dashboard-wrapper">
            <Histogram />
        </div>
    )
}
