import React from 'react';
import Fade from '@mui/material/Fade';
import "./about-us.scss";

export default function AboutUs() {

    const fadeDuration = 400;
    const fadeOffset = 100;

    return (
        <Fade in={true} timeout={fadeDuration} style={{ transitionDelay: 50+0*fadeOffset+'ms' }}>
            <div className="au-wrapper">
            </div>
        </Fade>
    )
}