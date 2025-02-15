import React from "react";
import classes from "./Svg.module.css";

function DownloadBracketIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            fill="#000"
            version="1.1"
            viewBox="0 0 24 24"
            xmlSpace="preserve"
            className={classes.tools_svg}
        >
            <path d="M24 24H0v-8h2v6h20v-6h2v8zm-12-5.6l-7.7-7.7 1.4-1.4 5.3 5.3V0h2v14.6l5.3-5.3 1.4 1.4-7.7 7.7z"></path>
        </svg>
    );
}

export default DownloadBracketIcon;
