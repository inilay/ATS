import { useState, useContext, Fragment } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import classes from "./Swiss.module.css";


const Swiss = ({bracket}) => {

  console.log('bracket ыц', bracket);

  return (
    <section>
      <div className={`${classes.bracket}`}>
        {bracket.map((round) => (
          <Fragment>
            <div className={`${classes.row}`}>
            { round.matches.map((match) => (
                <div className={`${classes.match}`}>
                    {
                    match.info.map((team) => (
                        <div className={`${classes.team}`}>
                        <span className={`${classes.name}`}>{team.participant}</span>
                        <span className={`${classes.score}`}>{team.participant_scoore}</span>
                        </div>
                    ))
                    }
                </div>
            )
            )}
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
};

export default Swiss;
