import React from "react";
import classes from "./ThemeSwitcher.module.css";
import ThemeSwitcherIcon from "../../../assets/svg/ThemeSwitcherIcon";

const ThemeSwitcher = ({ additionalCl, ...props }) => {
    const lightTheme = "light";
    const darkTheme = "dark";
    let theme;

    if (localStorage) {
        theme = localStorage.getItem("theme");
    }

    if (theme === lightTheme || theme === darkTheme) {
        document.body.classList.add(theme);
    } else {
        document.body.classList.add(lightTheme);
    }

    const switchTheme = (e) => {
        if (theme === darkTheme) {
            document.body.classList.replace(darkTheme, lightTheme);
            e.target.classList.remove("clicked");
            localStorage.setItem("theme", "light");
            theme = lightTheme;
        } else {
            document.body.classList.replace(lightTheme, darkTheme);
            e.target.classList.add("clicked");
            localStorage.setItem("theme", "dark");
            theme = darkTheme;
        }
    };

    return (
        <button
            onClick={(e) => switchTheme(e)}
            className={`${classes.btn_circle} ${additionalCl} ${"btn"} ${"shadow-none"}`}
            {...props}
        >
            <ThemeSwitcherIcon />
            <i className={`${"bi"} ${"bi-brightness-high-fill"}`}></i>
        </button>
    );
};

export default ThemeSwitcher;
