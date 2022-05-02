import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {cookieTypeLabels} from '../../../../scripts/miscellaneous/common.js'
import "./controls.scss";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function CookieTable() {

    let [rows, setRows] = useState([]);
    let [originalRows, setOriginalRows] = useState([]);

    const constructData = (lastCookieUpdateDates, cookieTypes) => {

        const cleanDomainName = (domain) => {
            if (domain[0] == '.') domain = domain.substr(1);
            if (domain.substr(0, 4) == "www.") domain = domain.substr(4);
            return domain;
        }

        const getCookieSize = (cookie) => {
            let cookieString = "";
            for (const [key, value] of Object.entries(cookie)) {
                cookieString += key + "=" + value + "; ";
            }
            return cookieString.length / 1024;
        }

        // Fetch all cookies
        chrome.cookies.getAll({}, async function (cookies) {
            let _data = [];
            for (let cookie of cookies) {

                // Fetch base info
                let domain = cookie.domain;
                let name = cookie.name;

                // Query last used date
                let key = "domain" + domain + "name" + name;
                let lastUsed = lastCookieUpdateDates[key];
                if (!lastUsed) lastUsed = Date.now().toString();

                // Compute type (WIP: might be stored in local storage and passed as param)
                let type = "Unknown";
                if (cookieTypes[key]) {
                    type = cookieTypeLabels[cookieTypes[key]];
                }
                else {
                    //let clabel = await classifyCookie(createFEInput(cookie));
                    //type = cookieTypeLabels[clabel];
                }
                
                // Compute cookie storage size (WIP: idk how to do it yet)
                let size = getCookieSize(cookie);

                // Update data
                domain = cleanDomainName(domain);
                let dataKey = "domain" + domain + "type" + type;
                let row = _data[dataKey];
                // If there's no associated row (with that domain and type), create the data row
                if (row == null) {
                    _data[dataKey] = {
                        "website": domain,
                        "type": type,
                        "cookies": 1,
                        "storage": size,
                        "lastUsed": lastUsed,
                        "cookieList": [cookie]
                    }
                }
                // Otherwise, update the data row
                else {
                    row["cookies"] += 1;
                    row["storage"] += size;
                    if (lastUsed > row["lastUsed"]) {
                        row["lastUsed"] = lastUsed;
                    }
                    row["cookieList"].push(cookie);
                    _data[dataKey] = row;
                }

            }

            // Put object in an array
            let _rows = Object.keys(_data).map(function (key) { return _data[key]; });
            setRows(_rows);
            setOriginalRows(_rows);

        })
    }

    const deleteCookies = (selected) => {

        let deleted = {};
        for (let i in selected) {
            let selection = selected[i];
            for (let j in selection.cookieList) {

                // Delete cookies
                let cookie = selection.cookieList[j];
                let url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
                chrome.cookies.remove({ "url": url, "name": cookie.name });

                // Store number of deleted cookies by type
                if (deleted[selection.type] == null) {
                    deleted[selection.type] = selection.cookies;
                }
                else {
                    deleted[selection.type] += selection.cookies;
                }
            }
        }

        // Filter and unselect table rows
        const filterFunction = (e) => { return selected.indexOf(e) == -1; }
        setRows(rows.filter(filterFunction));
        setOriginalRows(originalRows.filter(filterFunction));
        setSelected([]);

        // Store deleted cookies
        chrome.storage.sync.get(["manuallyDeletedCookies"], res => {
            let data = {};
            if (res && res.manuallyDeletedCookies) {
                data = res.manuallyDeletedCookies;
            }
            data[Date.now().toString()] = deleted;
            chrome.storage.sync.set({ "manuallyDeletedCookies": data }, () => {
                if (chrome.runtime.error) {
                    console.log("Runtime error.");
                }
            });
        });

    }

    useEffect(() => {

        // Fetch last used date map, construct data using it
        chrome.storage.sync.get(["updateDateCookies"], function (res1) {
            let lastCookieUpdateDates = res1.updateDateCookies;
            chrome.storage.sync.get(["cookieTypes"], function (res2) {
                let cookieTypes = res2.cookieTypes;               
                constructData(lastCookieUpdateDates, cookieTypes);
            });
        });

    }, []);

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('cookies');
    const [selected, setSelected] = useState([]);
    const [domainSearch, setDomainSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [daysFilter, setDaysFilter] = useState("");
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(rows);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, row) => {
        const selectedIndex = selected.indexOf(row);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, row);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const isSelected = (row) => selected.indexOf(row) !== -1;

    const formatDate = (date) => {
        let diff = Math.round(((new Date().getTime()) - (new Date(parseInt(date)).getTime())) / (1000 * 3600 * 24));
        return (diff == 0) ? "Today" : diff + " day" + (diff == 1 ? "" : "s") + " ago";
    }

    const requestDomainSearch = (searchTerm) => {
        setDomainSearch(searchTerm);
        filterRows(searchTerm, typeFilter, daysFilter);
    };

    const cancelDomainSearch = () => {
        setDomainSearch("");
        filterRows("", typeFilter, daysFilter);
    };

    const requestTypeFilter = (searchTerm) => {
        setTypeFilter(searchTerm);
        filterRows(domainSearch, searchTerm, daysFilter);
    }

    const requestDaysFilter = (searchTerm) => {
        if (searchTerm >= 0) {
            setDaysFilter(searchTerm);
            filterRows(domainSearch, typeFilter, searchTerm);
        }
    }

    const filterRows = (domainSearch, typeFilter, daysFilter) => {
        console.log(domainSearch + "; " + typeFilter + "; " + daysFilter)
        let searchDomain = domainSearch.length > 0;
        let filterType = typeFilter.length > 0 && typeFilter != "Any";
        let filterDays = daysFilter > 0;
        const filteredRows = originalRows.filter((row) => {
            let lastUsed = Math.round(((new Date().getTime()) - (new Date(parseInt(row.lastUsed)).getTime())) / (1000 * 3600 * 24));
            return ((row.website.toLowerCase().includes(domainSearch.toLowerCase()) && searchDomain) || !searchDomain)
                && ((row.type.toLowerCase() == typeFilter.toLowerCase() && filterType) || !filterType)
                && ((lastUsed >= daysFilter && filterDays) || !filterDays);
        });
        setRows(filteredRows);
    }

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const colWidths = ["5%", "24%", "14%", "9%", "9%", "14%"];
    const headCells = [
        {
            id: 'website',
            numeric: false,
            disablePadding: true,
            label: 'Website',
        },
        {
            id: 'type',
            numeric: true,
            disablePadding: false,
            label: 'Type',
        },
        {
            id: 'cookies',
            numeric: true,
            disablePadding: false,
            label: 'Cookies',
        },
        {
            id: 'storage',
            numeric: true,
            disablePadding: false,
            label: 'Storage',
        },
        {
            id: 'lastUsed',
            numeric: true,
            disablePadding: false,
            label: 'Last used',
        },
    ];

    const EnhancedTableHead = (props) => {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox" style={{ width: colWidths[0] }}>
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{ 'aria-label': 'select all cookies' }}
                        />
                    </TableCell>
                    {headCells.map((headCell, index) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                            style={{ width: colWidths[index + 1] }}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }
    EnhancedTableHead.propTypes = {
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
    };

    const EnhancedTableToolbar = (props) => {
        const { selected } = props;

        return (
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(selected.length > 0 && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    }),
                }}
            >
                {selected.length > 0 ? (
                    <Typography
                        sx={{ flex: '1 1 100%', fontWeight: 'bold' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {selected.length} selected
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: '1 1 100%', fontWeight: 'bold' }}
                        color="inherit"
                        variant="h6"
                        component="div"
                    >
                        Locally stored cookies
                    </Typography>
                )}

                <Button size="small" variant="contained" startIcon={<DeleteIcon />} disabled={selected.length <= 0}
                    onClick={() => { deleteCookies(selected) }}>
                    Clear selected
                </Button>

            </Toolbar>
        );
    };
    EnhancedTableToolbar.propTypes = {
        selected: PropTypes.array.isRequired,
    };

    return (
        <div className="cookie-table">

            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <EnhancedTableToolbar selected={selected} />
                    <div className="filter-toolbar">
                        <div className="search-bar">
                            <FormControl variant="outlined" size="small">
                                <InputLabel htmlFor="domain-search-input">Domain</InputLabel>
                                <OutlinedInput
                                    id="domain-search-input"
                                    label="doma"
                                    type="text"
                                    value={domainSearch}
                                    onChange={(event) => requestDomainSearch(event.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => cancelDomainSearch()} edge="end">
                                                {domainSearch.length == 0 ? <SearchIcon /> : <CloseIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </div>
                        <div className="type-filter-bar">
                            <FormControl sx={{ minWidth: 240 }} size="small">
                                <InputLabel id="type-filter-input">Type</InputLabel>
                                <Select
                                    labelId="type-filter-input"
                                    id="type-filter-input"
                                    value={typeFilter}
                                    label="Typ"
                                    onChange={(event) => requestTypeFilter(event.target.value)}
                                >
                                    <MenuItem value={""}><em>Any</em></MenuItem>
                                    <MenuItem value={"necessary"}>Necessary</MenuItem>
                                    <MenuItem value={"functional"}>Functional</MenuItem>
                                    <MenuItem value={"analytics"}>Analytics</MenuItem>
                                    <MenuItem value={"advertising"}>Advertising</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="days-filter-bar">
                            <FormControl variant="outlined" size="small">
                                <InputLabel htmlFor="days-filter-input">Older than ...</InputLabel>
                                <OutlinedInput
                                    id="days-filter-input"
                                    label="Older than"
                                    type="number"
                                    value={daysFilter}
                                    onChange={(event) => requestDaysFilter(event.target.value)}
                                    endAdornment={<InputAdornment position="end">days</InputAdornment>}
                                />
                            </FormControl>
                        </div>
                    </div>
                    <TableContainer>
                        <Table sx={{ minWidth: 750 }} size="small" aria-labelledby="tableTitle">
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {rows.slice().sort(getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {

                                        const isItemSelected = isSelected(row);
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(event, row)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.website + ":" + row.type}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox" style={{ width: colWidths[0] }}>
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    style={{ width: colWidths[1] }}
                                                >
                                                    {row.website}
                                                </TableCell>
                                                <TableCell align="right" style={{ width: colWidths[2] }}>{row.type}</TableCell>
                                                <TableCell align="right" style={{ width: colWidths[3] }}>{row.cookies}</TableCell>
                                                <TableCell align="right" style={{ width: colWidths[4] }}>{Math.round(row.storage * 100) / 100 + " kB"}</TableCell>
                                                <TableCell align="right" style={{ width: colWidths[5] }}>{formatDate(row.lastUsed)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: (33) * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[rowsPerPage]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        labelDisplayedRows={(e) => { return e.from + " - " + e.to + " of " + (e.count !== -1 ? e.count : "more than " + e.to); }}
                    />
                </Paper>
            </Box>
        </div>
    );

}