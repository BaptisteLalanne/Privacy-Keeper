import React from 'react';
import Fade from '@mui/material/Fade';
import "./about-us.scss";

export default function AboutUs() {

    const fadeDuration = 400;
    const fadeOffset = 100;

    return (
        <Fade in={true} timeout={fadeDuration} style={{ transitionDelay: 50 + 0 * fadeOffset + 'ms' }}>
            <div className="au-wrapper">
                <p>
                    Here at Privacy Keeper, we value privacy.
                </p>
                <br />
                <p>
                    Using machine learning, we developed a state of the art cookies &amp; tracker detection tool to help you protect your navigation on the web.
                    Our team of computer scientists built the Privacy Keeper add-on using our in-house technology, to place our knowledge at your service.
                </p>
                <br />
                <p>
                    Entirely free and open source, you can learn more <a href="/learn-more">here</a>.
                </p>
                <br />
                <br />
                <p style={{ fontSize: "12px" }}>
                    Privacy Keeper v0.1 - Ⓒ 2022
                </p>
            </div>
        </Fade>
    )
}