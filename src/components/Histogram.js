import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import "./dashboard.scss";
//import Histogram from './Histogram.js';


function Histogram() {
    return (
        <div className="title">
            <h1>Coucou je suis un histogram</h1>

        </div>
    )
}

const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page B', uv: 50, pv: 4500, amt: 44},{name: 'Page B', uv: 800, pv: 800, amt: 2000}];

const renderLineChart = (
    <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );

export default Histogram;


