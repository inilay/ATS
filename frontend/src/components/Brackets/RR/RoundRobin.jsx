import { useState, useContext, Fragment } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import MatchInfoIcon from "../../../assets/svg/MatchInfoIcon";
import MatchJudgeIcon from "../../../assets/svg/MatchJudgeIcon";
import classes from "./RoundRobin.module.css";


const RoundRobin = ({bracket, bracketId}) => {

  console.log('bracket ыц', bracket);

  return (
    <div>
      <div className={`${classes.bracket}`}>
        {bracket.map((round) => (
          <Fragment>
            <div className={`${classes.row}`}>
            { round.matches.map((match) => (
                <div className={`${classes.match}`}>
                    {
                    match.info.map((team) => (
                        <div className={`${classes.team}`}>
                          <div className={`${classes.name}`}>{team.participant}</div>
                          <div className={`${classes.score}`}>{team.participant_score}</div>
                        </div>
                    ))
                    }
                    <div className={classes.button_container}>
                      <button
                        className={classes.icon_button}
                      >
                        <MatchInfoIcon />
                      </button>
                      <button
                        className={classes.icon_button}
                      >
                        <MatchJudgeIcon />
                      </button>
                    </div>
                </div>
                
            )
            )}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default RoundRobin;
