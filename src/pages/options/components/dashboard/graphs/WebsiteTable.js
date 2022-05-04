import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Divider from '@mui/material/Divider';
import style from "./../dashboard.scss";
import { mapRange, mixColors } from "./../../../../../scripts/miscellaneous/common.js";

export default function WebsiteTable() {

  let [data, setData] = useState([]);

  useEffect(() => {

    chrome.storage.local.get("websiteScores", function (res) {
      let websiteScores = {};
      if (res && res.websiteScores) { websiteScores = res.websiteScores; }
      console.log(websiteScores);

      let sortable = [];
      for (const [key, value] of Object.entries(websiteScores)) {
        sortable.push({ "nom": key, "score": (value.cookie + value.tracker) / 2 });
      }
      sortable.sort(function (a, b) {
        return a.score - b.score;
      });

      let meilleursSites = sortable;
      let piresSites = sortable;
      let n = sortable.length;
      if (n >= 10) {
        meilleursSites = sortable.slice(0, 5);
        piresSites = sortable.slice(n - 5, n);
      }
      else if (n >= 5) {
        meilleursSites = sortable.slice(0, n - 5);
        piresSites = sortable.slice(n - 5, n);
      }
      else {
        meilleursSites = sortable.slice(0, n);
      }
      piresSites = piresSites.reverse();

      let _data = [];
      for (let i = 0; i < 5; i++) {
        _data.push({
          "neg-nom": ((i < piresSites.length) ? (piresSites[i].nom + " :") : ("...")),
          "neg-score": ((i < piresSites.length) ? (Math.round(piresSites[i].score) + "%") : ("")),
          "pos-nom": ((i < meilleursSites.length) ? (meilleursSites[i].nom + " :") : ("...")),
          "pos-score": ((i < meilleursSites.length) ? (Math.round(meilleursSites[i].score) + "%") : (""))
        });
      }
      setData(_data);

    });

  }, []);

  return (
    <div className="dashboard-box">
      <div className="graph-title">
        <Divider textAlign="center">Safest and riskiest websites you browsed</Divider>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" className="table-right-border-cell table-header-cell" style={{ color: style.graphcol1 }}>Riskiest websites</TableCell>
              <TableCell align="center" className="table-header-cell" style={{ color: style.graphcol2 }}>Safest websites</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row["pos-nom"]}>
                <TableCell align="center"
                  className={
                    "table-right-border-cell " + ((index == 0) ? "table-top-padding-cell" : "")
                  }
                  style={{
                    color: mixColors(style.graphcol1, "#000000", mapRange(index, 0, 5, 0.1, 0.9))
                  }}>
                  <div className="table-content-cell">
                    <div>{row["neg-nom"]}</div>
                    <div>{row["neg-score"]}</div>
                  </div>
                </TableCell>
                <TableCell align="center"
                  className={
                    (index == 0) ? "table-top-padding-cell" : ""
                  }
                  style={{
                    color: mixColors(style.graphcol2, "#000000", mapRange(index, 0, 5, 0.1, 0.9))
                  }}>
                  <div className="table-content-cell" >
                    <div>{row["pos-nom"]}</div>
                    <div>{row["pos-score"]}</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="graph-explanation">
        Be careful about these websites!
      </div>
    </div>
  )
}




