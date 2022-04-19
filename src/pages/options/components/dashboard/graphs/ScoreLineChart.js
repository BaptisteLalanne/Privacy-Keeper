import React, { PureComponent } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Divider from '@mui/material/Divider';
import style from "./../dashboard.scss";

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

export default function ScoreLineChart() {

  const mapRange = (x, min1, max1, min2, max2) => {
    return (x-min1)/(max1-min1) * (max2-min2) + min2;
  }

  const nonPeriodicSine = (x) => {
    return ((Math.sin(2 * 0.15 * x) + Math.sin(Math.PI * 0.15 * x)) / 2 + 1) * 20 + 40;
  }
  
  // Generate random data
  let data = [];
  const today = new Date();
  for (let i = 31; i >= 0; i--) {
    let slope =  mapRange(i, 31, 0, 1, 0.5);
    let key = new Date(today); key.setDate(today.getDate() - i);
    let formattedKey = key.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + "/" + 
                       key.getMonth().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    data.push({
      "Time": formattedKey,
      "Cookie intrusiveness": Math.round(nonPeriodicSine(i)*slope),
      "Tracking suspicion": Math.round(nonPeriodicSine(i - 100)*slope)
    });
  }

  return (
    <div className="dashboard-box">
        <ResponsiveContainer width="99%" height={300}>
          <LineChart width={600} height={300} data={data} margin={{ top: 32, right: 20, bottom: 20, left: -10 }} className="graph">
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
            <XAxis dataKey="Time" tick={<CustomizedTimeTick />} />
            <YAxis type="number" domain={[0, 100]} />
            <Legend align="right" verticalAlign="top" />
            <Tooltip formatter={(value, name, props) => value+"%"}/>
            <Line type="natural" dataKey="Cookie intrusiveness" stroke={style.col1} strokeWidth={1.5} animationDuration={800} dot={false}/>
            <Line type="natural" dataKey="Tracking suspicion" stroke={style.col5} strokeWidth={1.5} animationDuration={800} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
        <div className="graph-title">
          <Divider textAlign="center">Average privacy risk of the websites you browsed in the past month</Divider> 
        </div>
    </div>
  )
}




