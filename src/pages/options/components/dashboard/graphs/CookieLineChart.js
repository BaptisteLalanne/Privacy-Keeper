import React, { PureComponent } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Divider from '@mui/material/Divider';
import style from "./../dashboard.scss";

const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page B', uv: 50, pv: 4500, amt: 44},{name: 'Page B', uv: 800, pv: 800, amt: 2000}];

// Custom Time Label
class CustomizedTimeTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
          {payload.value}
        </text>
      </g>
    );
  }
}

export default function CookieLineChart() {

  const mapRange = (x, min1, max1, min2, max2) => {
    return (x-min1)/(max1-min1) * (max2-min2) + min2;
  }

  const nonPeriodicSine = (x, max) => {
    return ((Math.sin(2 * 0.15 * x) + Math.sin(Math.PI * 0.15 * x)) / 2 + 1) * max + 2*max;
  }
  
  // Generate random data
  let data = [];
  const today = new Date();
  for (let i = 31; i >= 0; i--) {
    let slope = mapRange(i, 31, 0, 1, 0.25);
    let key = new Date(today); key.setDate(today.getDate() - i);
    let formattedKey = key.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + "/" + 
                       key.getMonth().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    data.push({
      "Time": formattedKey,
      "Necessary": Math.round(nonPeriodicSine(i, 1500)*slope),
      "Functional": Math.round(nonPeriodicSine(i - 100, 2000)*slope),
      "Analytics": Math.round(nonPeriodicSine(i - 200, 2500)*slope),
      "Advertising": Math.round(nonPeriodicSine(i - 300, 3000)*slope)
    });
  }

    return (
        <div className="dashboard-box">
          <ResponsiveContainer width="99%" height={300}>
            <LineChart width={600} height={300} data={data} margin={{ top: 32, right: 20, bottom: 20, left: -10 }} className="graph">
              <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
              <XAxis dataKey="Time" tick={<CustomizedTimeTick />} />
              <YAxis type="number" />
              <Legend align="right" verticalAlign="top" />
              <Tooltip formatter={(value, name, props) => [value, name + " cookies"]} />
              <Line type="natural" dataKey="Necessary" stroke={style.col1} strokeWidth={1.5} animationBegin={150} animationDuration={800} dot={false}/>
              <Line type="natural" dataKey="Functional" stroke={style.col2} strokeWidth={1.5} animationBegin={150} animationDuration={800} dot={false}/>
              <Line type="natural" dataKey="Analytics" stroke={style.col3} strokeWidth={1.5} animationBegin={150} animationDuration={800} dot={false}/>
              <Line type="natural" dataKey="Advertising" stroke={style.col4} strokeWidth={1.5} animationBegin={150} animationDuration={800} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
          <div className="graph-title">
            <Divider textAlign="center">Number of cookies detected in the past month</Divider> 
          </div>
        </div>
    )
}




