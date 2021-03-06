import React, { useCallback, useState, useEffect } from 'react'
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
        chrome.storage.local.get("whitelist", function (result) {
            let whitelist = [];
            if (result && result.whitelist) {
                whitelist = result.whitelist;
            }
            setRows(whitelist);
        });

    }, []);

    const deleteCookies = useCallback((index) => {
        let copy = [...rows];
        copy.splice(index, 1);
        setRows(copy);
        chrome.storage.local.set({ "whitelist": copy });
    }, [setRows]);

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
                                                        <IconButton className="whitelist-delete-icon" onClick={() => deleteCookies(index)}> <CloseIcon /> </IconButton>
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