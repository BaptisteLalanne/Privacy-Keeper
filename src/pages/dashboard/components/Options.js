import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
} from "react-router-dom";
import "./options.scss";
import Popup from '../../popup/components/Popup.js';

function Options() {
    return (
        <Router>
            <div style={styles.container}>
                <div style={styles.nav_bar}>
                    <h1>Chrome Ext - Options</h1>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Options</Link>
                            </li>
                            <li>
                                <Link to="/popup">Popup</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </Router>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    nav_bar: {
        // position: 'relative',
        // left: '50%',
        // transform: 'translate(-50%, 0%)',
        // width: 'fit-content',
        marginBottom: '50px'
    }
}

export default Options;