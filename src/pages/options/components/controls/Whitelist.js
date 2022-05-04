import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import "./controls.scss";

export default function CookieTable() {

    let [rows, setRows] = useState([]);

    useEffect(() => {

        // Fetch whitelist
        chrome.storage.local.get("unused_cookies_wl", function (result) {
            let whitelist = [];
            if (result && result.unused_cookies_wl) {
                whitelist = result.unused_cookies_wl;
            }
            setRows(whitelist);
        });

    }, []);

    const deleteItem = (toBeDeleted) => {

        // Filter and unselect table row
        const index = rows.indexOf(toBeDeleted);
        if (index > -1) {
            rows.splice(index, 1);
        }
        console.log(rows);
        setRows(rows);
        
        // Remove from storage
        chrome.storage.local.get(["unused_cookies_wl"], res => {
            let whitelist = {};
            if (res && res.unused_cookies_wl) {
                whitelist = res.unused_cookies_wl;
            }
            const index = whitelist.indexOf(toBeDeleted);
            if (index > -1) {
                whitelist.splice(index, 1);
            }
            chrome.storage.local.set({ "unused_cookies_wl": whitelist });
        });

    };

    return (
        <div className="whitelist-wrapper">
            <div className="whitelist-explanation">
                PrivacyKeeper won't automatically block or delete any cookies coming from these whitelisted websites. If you wish to add a website to this list, please visit it and mark it as safe from the popup menu.
            </div>
            <div className="whitelist-table">
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <TableContainer>
                        <Table size="small">
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="whitelist-row">
                                                {row}
                                                <Tooltip title={"Remove from whitelist"} placement="right">
                                                    <IconButton className="whitelist-delete-icon" onClick={() => deleteItem(row)}> <CloseIcon /> </IconButton>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </div>
        </div>
    );

}