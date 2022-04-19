import React, { PureComponent } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import style from "./../dashboard.scss";

export default function WebsiteTable() {

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

  let rows = [];
  for (let i = 0; i < 5; i++) {
    rows.push({
      "neg-nom": piresSites[i].nom,
      "neg-score": piresSites[i].score,
      "pos-nom": meilleursSites[i].nom,
      "pos-score": meilleursSites[i].score
    });
  }

  return (
    <div className="dashboard-box">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Riskiest websites</TableCell>
              <TableCell align="center">Safest websites</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row["pos-nom"]}>
                <TableCell align="center">{row["neg-nom"]}</TableCell>
                <TableCell align="center">{row["pos-nom"]}</TableCell>
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




