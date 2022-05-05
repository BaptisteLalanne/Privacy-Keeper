import React, { useState, useEffect } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Divider from '@mui/material/Divider';
import style from "./../dashboard.scss";
import { getCookieKey } from "../../../../../scripts/miscellaneous/common.js";

export default function CookieHisto() {

  let [data, setData] = useState([]);
  let [dominantType, setDominantType] = useState("necessary")

  useEffect(() => {

    const labels = ["Necessary", "Functional", "Analytics", "Advertising"];
    let labelCounts = [0, 0, 0, 0];

    chrome.storage.local.get("cookieTypes", async function (res) {

      // Fetch stored cookie types
      let cookieTypes = {};
      if (res && res.cookieTypes) { cookieTypes = res.cookieTypes; }

      // Fetch all cookies
      chrome.cookies.getAll({}, function (cookies) {

        // Increment type counters
        for (let cookie of cookies) {
          let key = getCookieKey(cookie);
          let type = cookieTypes[key];
          if (type == undefined || type == -1) continue;
          labelCounts[type] += 1;
        }
        let dominant = Math.max(...labelCounts);
        if (dominant == labelCounts[0]) { setDominantType("necessary"); }
        else if (dominant == labelCounts[1]) { setDominantType("used for function"); }
        else if (dominant == labelCounts[2]) { setDominantType("used for analytics"); }
        else if (dominant == labelCounts[3]) { setDominantType("used for targeted ads"); }


        // Populate data
        let _data = [];
        for (let i in labels) {
          _data.push({
            "Type": labels[i],
            "Number": labelCounts[i]
          });
        }
        setData(_data);

      });
    });

  }, []);

  const COLORS = [style.graphcol2, style.graphcol4, style.graphcol3, style.graphcol1];
  let TOTAL = 0; for (let i in data) { TOTAL += data[i]["Number"]; }

  return (
    <div className="dashboard-box">
      <div className="graph-title">
        <Divider textAlign="center">Cookies stored on this device</Divider>
      </div>
      <div className="graph-wrapper" id="cookie-histogram-wrapper">
        <ResponsiveContainer width="99%" height={300}>
          <BarChart width={600} height={300} data={data} margin={{ top: 32, right: 30, left: 20, bottom: 0 }} >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Type" />
            <YAxis />
            <Tooltip labelFormatter={(label) => label + " cookies"} formatter={(value, name, props) => [value + " (" + Math.round(100 * value / TOTAL) + "%)"]} />
            <Bar dataKey="Number" stackId="a" fill={"black"} animationBegin={225}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="graph-explanation">
        Most of the stored cookies are {dominantType}.
      </div>
    </div>
  )
}




