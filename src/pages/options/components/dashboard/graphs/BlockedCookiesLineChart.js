import React, { useState, useEffect, PureComponent } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Divider from '@mui/material/Divider';
import style from "./../dashboard.scss";
import { mapRange, nonPeriodicSine } from "../../../../../scripts/miscellaneous/common.js";

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

export default function BlockedCookiesLineChart() {

  let [data, setData] = useState([]);

  useEffect(() => {

    /*
    // Retrieve history of blocked cookies
    chrome.storage.local.get("blockedCookiesHistory", function (res) {
      let blockedCookiesHistory = {};
      if (res && res.blockedCookiesHistory) { blockedCookiesHistory = res.blockedCookiesHistory; }
      let _data = [];
      const today = new Date();
      for (let i = 31; i >= 0; i--) {
        let timestamp_i = new Date(today); timestamp_i.setDate(today.getDate() - i);
        let date_i = timestamp_i.getDate() + "/" + timestamp_i.getMonth() + "/" + timestamp_i.getFullYear();
        if (blockedCookiesHistory[date_i] != undefined) {
          let formatted_date_i = timestamp_i.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + "/" +
            timestamp_i.getMonth().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
          _data.push({
            "Time": formatted_date_i,
            "Analytics": blockedCookiesHistory[date_i][0],
            "Advertising": blockedCookiesHistory[date_i][1]
          });
        }
      }
      setData(_data);
    });
    */

    // Generate random data
    let _data = [];
    const today = new Date();
    for (let i = 31; i >= 0; i--) {
      let slope = mapRange(i, 31, 0, 1, 0.25);
      let key = new Date(today); key.setDate(today.getDate() - i);
      let formattedKey = key.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + "/" +
        key.getMonth().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
      _data.push({
        "Time": formattedKey,
        "Analytics": Math.round(nonPeriodicSine(i - 200, 2500) * slope),
        "Advertising": Math.round(nonPeriodicSine(i - 300, 3000) * slope)
      });
    }
    setData(_data);

  }, []);

  const COLORS = [style.graphcol2, style.graphcol4, style.graphcol3, style.graphcol1];

  return (
    <div className="dashboard-box" id="cookie-line-chart-wrapper">
      <div className="graph-title">
        <Divider textAlign="center">Number of cookies blocked in the past month</Divider>
      </div>
      <ResponsiveContainer width="99%" height={300}>
        <LineChart width={600} height={300} data={data} margin={{ top: 32, right: 20, bottom: 20, left: -10 }} className="graph">
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <XAxis dataKey="Time" tick={<CustomizedTimeTick />} />
          <YAxis type="number" />
          <Legend align="right" verticalAlign="top" />
          <Tooltip formatter={(value, name, props) => [value, name + " cookies blocked"]} />
          <Line type="natural" dataKey="Analytics" stroke={COLORS[2]} strokeWidth={1.5} animationBegin={150} animationDuration={800} dot={false} />
          <Line type="natural" dataKey="Advertising" stroke={COLORS[3]} strokeWidth={1.5} animationBegin={150} animationDuration={800} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="graph-explanation">
        Privacy Keeper keeps you safe from these intrusive cookies!
      </div>
    </div>
  )
}




