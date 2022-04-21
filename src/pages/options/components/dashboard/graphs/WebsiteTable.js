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

    const meilleursSites = [
      { "nom": "meilleur-site-1.com", "score": 0 },
      { "nom": "meilleur-site-2.com", "score": 2 },
      { "nom": "meilleur-site-3.com", "score": 5 },
      { "nom": "meilleur-site-4.com", "score": 6 },
      { "nom": "meilleur-site-5.com", "score": 8 },
    ]
    const piresSites = [
      { "nom": "pire-site-1.com", "score": 99 },
      { "nom": "pire-site-2.com", "score": 95 },
      { "nom": "pire-site-3.com", "score": 92 },
      { "nom": "pire-site-4.com", "score": 87 },
      { "nom": "pire-site-5.com", "score": 86 },
    ]
    let _data = [];
    for (let i = 0; i < 5; i++) {
      _data.push({
        "neg-nom": piresSites[i].nom,
        "neg-score": piresSites[i].score,
        "pos-nom": meilleursSites[i].nom,
        "pos-score": meilleursSites[i].score
      });
    }
    setData(_data);

  }, []);

  return (
    <div className="dashboard-box">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" className="table-right-border-cell table-header-cell" style={{color: style.graphcol1}}>Riskiest websites</TableCell>
              <TableCell align="center" className="table-header-cell" style={{color: style.graphcol2}}>Safest websites</TableCell>
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
                    <div>{row["neg-nom"] + " :"}</div>
                    <div>{row["neg-score"] + "%"}</div>
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
                    <div>{row["pos-nom"] + " :"}</div>
                    <div>{row["pos-score"] + "%"}</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="graph-title">
        <Divider textAlign="center">Safest and riskiest websites you browsed</Divider>
      </div>
    </div>
  )
}




