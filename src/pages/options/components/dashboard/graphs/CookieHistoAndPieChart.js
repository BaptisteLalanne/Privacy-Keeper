import React, { useState, useEffect } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';
import Divider from '@mui/material/Divider';
import style from "./../dashboard.scss";

export default function CookieHistoAndPieChart() {

  let [data, setData] = useState([]);

  const handlePieRef = (e) => {
    var event = new MouseEvent('mouseover', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    let pie = document.getElementsByClassName("recharts-pie")[0];
    pie.dispatchEvent(event);
  };

  useEffect(() => {

    // Generate random data
    const labels = ["Necessary", "Functional", "Analytics", "Advertising"];
    let _data = [];
    for (let i in labels) {
      let randomNum = i*2000 + 4000 + Math.random() * 2000;
      let blockPercent = (i > 1) * (0.5 + Math.random() * 0.4);
      if (blockPercent > 0) {
        _data.push({
          "Type": labels[i],
          "Blocked": Math.round(randomNum * blockPercent),
          "Detected": Math.round(randomNum * (1 - blockPercent)),
          "Total": Math.round(randomNum)
        });
      }
      else {
        _data.push({
          "Type": labels[i],
          "Detected": Math.round(randomNum),
          "Total": Math.round(randomNum)
        });
      }
    }
    setData(_data);

  }, []);

  const COLORS = [style.graphcol2, style.graphcol4, style.graphcol3, style.graphcol1];
  let TOTAL = 0; for (let i in data) { TOTAL += data[i]["Total"]; }

  return (
    <div className="dashboard-box">
      <div className="dual-graph-wrapper">
        <div className="graph-wrapper" id="cookie-pie-wrapper">
          <ResponsiveContainer width="99%" height={300}>
            <PieChart>
              <Pie data={data} labelLine={false} outerRadius={80} 
                   nameKey="Type" dataKey="Total"  ref={handlePieRef}
                   animationBegin={225} animationDuration={800}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [Math.round(100*value/TOTAL)+"%", name + " cookies"]} />
              {/* <Legend align="left" verticalAlign="bottom" /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="graph-wrapper" id="cookie-histogram-wrapper">
          <ResponsiveContainer width="99%" height={300}>
            <BarChart width={600} height={300} data={data} margin={{ top: 32, right: 30, left: 20, bottom: 0 }} >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Type" tick={false}/>
              <YAxis />
              <Tooltip labelFormatter={(label) => label + " cookies"} formatter={(value, name, props) => [(value > 0) ? value : "", (value > 0) ? name : ""]}/>
              <Legend align="right" verticalAlign="bottom" />
              <Bar dataKey="Blocked" stackId="a" fill={"#202020"} animationBegin={225}> 
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={"#202020"} />
                ))}
              </Bar>
              <Bar dataKey="Detected" stackId="a" fill={"#606060"} animationBegin={225}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="graph-title">
        <Divider textAlign="center">Overall number of detected and blocked cookies</Divider>
      </div>
    </div>
  )
}




