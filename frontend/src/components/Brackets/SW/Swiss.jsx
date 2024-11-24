import { useState, useContext, Fragment } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import classes from "./Swiss.module.css";
import MatchInfoIcon from "../../../assets/svg/MatchInfoIcon";
import MatchJudgeIcon from "../../../assets/svg/MatchJudgeIcon";
import InfoModal from "../Modals/InfoModal/InfoModal.jsx";
import EditModal from "../Modals/EditModal/EditModal.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentMatch, setCurrentBracketId } from "../../../store/bracket.js";


const Swiss = ({bracket, bracketId}) => {
  const dispatch = useDispatch()
  const [modalShow, setMatchCardModalShow] = useState(false);
  const [modalEditShow, setEditMatchCardModalShow] = useState(false);

  const openInfoModal = (match) => {  
    setMatchCardModalShow(true)
    dispatch(setCurrentMatch({currentMatch: match}))

  }
  
  const openEditModal = (match) => {  
    setEditMatchCardModalShow(true)
    dispatch(setCurrentMatch({currentMatch: match}))
    dispatch(setCurrentBracketId({currentBracketId: bracketId}))

  }

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
                        onClick={() => openInfoModal(match)}
                      >
                        <MatchInfoIcon />
                      </button>
                      <button
                        className={classes.icon_button}
                        onClick={() => openEditModal(match)}
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
      <EditModal modalEditShow={modalEditShow} setEditMatchCardModalShow={setEditMatchCardModalShow} match={{}}/>
      <InfoModal modalShow={modalShow} setMatchCardModalShow={setMatchCardModalShow} match={{}}/>
    </div>
  );
};

export default Swiss;
