import React from 'react';
import Histogram from './Histogram.js';
import "./dashboard.scss";

export default function Dashboard() {
    return (
        <div className="main">
            <h1 className="title">Dashboard</h1>
            <Histogram />
        </div>
    )
}
