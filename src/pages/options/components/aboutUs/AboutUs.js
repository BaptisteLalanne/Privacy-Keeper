import React from 'react';
import Fade from '@mui/material/Fade';
import "./about-us.scss";

export default function AboutUs() {

    const fadeDuration = 400;
    const fadeOffset = 100;

    return (
        <Fade in={true} timeout={fadeDuration} style={{ transitionDelay: 50+0*fadeOffset+'ms' }}>
            <div className="au-wrapper">
                <p>
                At Privacy Keeper, we value privacy. We developed a state of the art cookies and tracker detection technology using machine learning. Our team of computer scientists built the  Privacy Keeper add-on based on our in-house technology to place our knowledge at your service. Entirely free and open source, you can  learn more <a href="/learn-more">here</a>.
                </p>
            </div>
        </Fade>
    )
}