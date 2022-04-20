import React from 'react';
import Grow from '@mui/material/Grow';

export default function AboutUs() {
    return (
        <Grow in={true} timeout={250} style={{ transformOrigin: '0 0 0' }}>
            <div>
                This is going to be the 'About us' page!
            </div>
        </Grow>
    )
}