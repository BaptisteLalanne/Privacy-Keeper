import React from 'react';
import Slide from '@mui/material/Slide';

export default function AboutUs() {
    return (
        <Slide in={true} direction="right" timeout={250}>
            <div>
                This is going to be the 'About us' page!
            </div>
        </Slide>
    )
}