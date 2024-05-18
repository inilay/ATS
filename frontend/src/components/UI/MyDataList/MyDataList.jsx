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
  
  const MyDataList = ({filter, setFilter, gamesFilter}) => {
    
    console.log(gamesFilter)
    
    const onChange = (event) => {
      setFilter({game: event.target.value, title: filter.title} );
      console.log(event.target.value)
    }
    
    const disabled = useMemo(() => {
      return !data.some( d => d.label === filter.game );
    }, [filter.game]);
    
    return (
      <div className="d-flex">
        <div>
          <input className={`${classes.myInput} shadow-none`} type="search" list="list" autoComplete="on"  value={filter.game} onChange={onChange} />
          <datalist className={classes.myDL} id="list">
            {gamesFilter.map(game => <option className={classes.myDLOpt} key={game} value={game} />)}
          </datalist>
        </div>
        {/* <div>
          <button className="btn btn-primary btn-sm" disabled={disabled}>OK</button>
        </div> */}
      </div>
    );
  }

export default MyDataList;