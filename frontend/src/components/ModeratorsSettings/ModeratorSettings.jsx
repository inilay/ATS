import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MyDataList from "../UI/MyDataList/MyDataList";
import MyButton from "../UI/MyButton/MyButton";
import PostService from "../../API/PostService";
import classes from './ModeratorSettings.module.css'


const ModeratorSettings = () => {

  useEffect(() => {

  }, []);

  const deleteModerator = () => {
    console.log('delete moderator');
    
  }

  const addModerator = () => {
    console.log('add moderator');
    
  }

  return (
    <div className={`${classes.modaretor_container} row`}>
      <h5>Moderator list</h5>
      <ul className={`${classes.moderators_container} list-group list-group-flush mb-4`}>
        <li className={`${classes.moderators_container} list-group-item d-flex justify-content-between align-items-start`}>
          <div class="me-auto">
            Subheading
          </div>
          <div onClick={(e) => {deleteModerator(e)}} className={`${classes.close} row`}></div>
        </li>
        <li className={`${classes.moderators_container} list-group-item d-flex justify-content-between align-items-start`}>
          <div class="me-auto">
            Subheading
          </div>
          <div onClick={(e) => {deleteModerator(e)}} className={`${classes.close} row`}></div>
        </li>
      </ul>
      <h5>Add moderator</h5>
      <div className={`${classes.add_moderator_container}`} > 
        <input type="text" className={`${classes.add_moderator_input}`} placeholder="Username" aria-label="Recipient's username with two button addons">
        </input>
        <button onClick={(e)=> addModerator(e)} className={`${classes.add_moderator_button}`} type="button">Add</button>
      </div>
    </div>
  );
};

export default ModeratorSettings;
