import React, { useState, useEffect, PureComponent } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Divider from '@mui/material/Divider';
import style from "./../dashboard.scss";
import { mapRange, nonPeriodicSine } from "./../../../../../scripts/miscellaneous/common.js";

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

  let [data, setData] = useState([]);

  useEffect(() => {

    chrome.storage.local.get("scoreHistory", function (res) {
      let scoreHistory = {};
      if (res && res.scoreHistory) { scoreHistory = res.scoreHistory; }
      console.log(scoreHistory)
    });

    // Generate random data
    let _data = [];
    const today = new Date();
    for (let i = 31; i >= 0; i--) {
      let slope = mapRange(i, 31, 0, 1, 0.5);
      let key = new Date(today); key.setDate(today.getDate() - i);
      let formattedKey = key.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + "/" +
        key.getMonth().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
      _data.push({
        "Time": formattedKey,
        "Cookie intrusiveness": Math.round(nonPeriodicSine(i, 20) * slope),
        "Tracking suspicion": Math.round(nonPeriodicSine(i - 100, 20) * slope)
      });
    }
    setData(_data);

  }, []);

  return (
    <div className="dashboard-box" id="score-line-chart-wrapper">
      <div className="graph-title">
        <Divider textAlign="center">Average privacy risk of the websites you browsed in the past month</Divider>
      </div>
      <ResponsiveContainer width="99%" height={300}>
        <LineChart width={600} height={300} data={data} margin={{ top: 32, right: 20, bottom: 20, left: -10 }} className="graph">
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <XAxis dataKey="Time" tick={<CustomizedTimeTick />} />
          <YAxis type="number" domain={[0, 100]} />
          <Legend align="right" verticalAlign="top" />
          <Tooltip formatter={(value, name, props) => value + "%"} />
          <Line type="natural" dataKey="Cookie intrusiveness" stroke={style.graphcol3} strokeWidth={1.5} animationDuration={800} dot={false} />
          <Line type="natural" dataKey="Tracking suspicion" stroke={style.graphcol1} strokeWidth={1.5} animationDuration={800} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="graph-explanation">
        Your browsing history has gotten safer over the past month.
      </div>
    </div>
  )
}
