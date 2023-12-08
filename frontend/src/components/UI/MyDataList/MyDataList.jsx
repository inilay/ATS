import React, { useState, useMemo, useEffect } from "react";
import classes from "./MyDataList.module.css";
import Dropdown from 'react-bootstrap/Dropdown';


const data = [
    { value: '1', label: 'Amazon' },
    { value: '2', label: 'Apple' },
    { value: '3', label: 'Facebook' },
    { value: '4', label: 'Google' },  
    { value: '5', label: 'Instagram' },  
    { value: '6', label: 'Microsoft' },
    { value: '7', label: 'Twitter' },
    { value: '8', label: 'YouTube' },
  ];
  
  const MyDataList = ({text, setText}) => {
    
    
    
    const onChange = (event) => {
      setText(event.target.value);
      console.log(event.target.value)
    }
    
    const disabled = useMemo(() => {
      return !data.some( d => d.label === text );
    }, [text]);
    
    return (
      <div className="d-flex">
        <div>
          <input className="search-input shadow-none" type="search" list="list" autoComplete="on"  value={text} onChange={onChange} />
          <datalist className={classes.myDL} id="list">
            { data.map( d => <option key={d.value} value={d.label} /> )}
          </datalist>
        </div>
        {/* <div>
          <button className="btn btn-primary btn-sm" disabled={disabled}>OK</button>
        </div> */}
      </div>
    );
  }

export default MyDataList;