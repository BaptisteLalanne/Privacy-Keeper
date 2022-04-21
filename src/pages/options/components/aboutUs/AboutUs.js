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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ligula risus, pellentesque id faucibus congue, tincidunt ut elit. Nam facilisis mollis mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In malesuada condimentum tellus quis venenatis. Cras in condimentum mauris. Ut eget justo condimentum, cursus orci scelerisque, mattis risus. Morbi elit tellus, placerat non enim nec, dapibus tempus enim. Pellentesque sapien orci, rutrum at rutrum quis, pellentesque eu augue. Praesent non diam augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
                </p>
            </div>
        </Fade>
    )
}