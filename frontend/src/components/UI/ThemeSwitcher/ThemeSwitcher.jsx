import React from "react";
import classes from './ThemeSwitcher.module.css';
import ThemeSwitcherIcon from "../../../assets/svg/ThemeSwitcherIcon";


const ThemeSwitcher = () => {
  let clickedClass = "clicked";
  const body = document.body;
  const lightTheme = "light";
  const darkTheme = "dark";
  let theme;

  if (localStorage) {
    theme = localStorage.getItem("theme");
  }

  if (theme === lightTheme || theme === darkTheme) {
    body.classList.add(theme);
  } else {
    body.classList.add(lightTheme);
  }

  const switchTheme = (e) => {
    if (theme === darkTheme) {
      body.classList.replace(darkTheme, lightTheme);
      e.target.classList.remove(clickedClass);
      localStorage.setItem("theme", "light");
      theme = lightTheme;
    } else {
      body.classList.replace(lightTheme, darkTheme);
      e.target.classList.add(clickedClass);
      localStorage.setItem("theme", "dark");
      theme = darkTheme;
    }
  };

  return (
    <button onClick={(e) => switchTheme(e)} className={`${classes.btn_circle} ${"btn"} ${"shadow-none"}`} >
                        <ThemeSwitcherIcon/>
                        <i className={`${"bi"} ${"bi-brightness-high-fill"}`}></i>
                      </button>
 
  );
};

export default ThemeSwitcher;