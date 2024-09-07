import { useState, useContext, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import MatchInfoIcon from "../../../assets/svg/MatchInfoIcon";
import MatchJudgeIcon from "../../../assets/svg/MatchJudgeIcon";
import classes from "./SingleElimination.module.css";
import InfoModal from "../Modals/InfoModal/InfoModal.jsx";
import EditModal from "../Modals/EditModal/EditModal.jsx";
import { setCurrentMatch } from "../../../store/bracket.js";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

const SingleElimination = ({bracket}) => {
  const dispatch = useDispatch()
  const [modalShow, setMatchCardModalShow] = useState(false);
  const [modalEditShow, setEditMatchCardModalShow] = useState(false);
  const t = 2

  // const [bracket, setBracket] = useState([ 
  //   [ [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'},], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'},],[{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'},], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'},] ],
  //   // [ [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'},], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'},] ],
  //   [ [{'name': 'Bill'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'},], [{'name': 'Bill'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'},] ],
  //   [ [{'name': 'Bill'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Add'}] ]
  //  ]);

  const openInfoModal = (match) => {  
    setMatchCardModalShow(true)
    dispatch(setCurrentMatch({currentMatch: match}))

  }
  
  const openEditModal = (match) => {  
    setEditMatchCardModalShow(true)
    dispatch(setCurrentMatch({currentMatch: match}))

  }

  return (
    <div>
      <div className={`${classes.bracket}`}>
        {bracket.map((round) => (
          <Fragment>
          <div className={`${classes.column}`}>
          { round.matches.map((match) => (
              <div className={`${classes.match}`}>
                <div className={classes.button_container}>
                {match?.startTime && 
                  <span>{moment.parseZone(match?.startTime).format("DD.MM h:mm a") || ""}</span>
                }
                </div>
                {
                  match.info.map((team) => (
                    <div className={`${classes.team}`}>
                      <div className={`${classes.name}`}>{team.participant}</div>
                      <div className={`${classes.score}`}>{team.participant_scoore}</div>
                    </div>
                  ))
                }
                <div className={classes.button_container}>
                  <button
                    onClick={() => openInfoModal(match)}
                    className={classes.icon_button}
                  >
                    <MatchInfoIcon />
                  </button>
                  <button
                    onClick={() => openEditModal(match)}
                    className={classes.icon_button}
                  >
                    <MatchJudgeIcon />
                  </button>
                </div>
                <div className={`${classes.match_lines}`}>
                  <div className={`${classes.line} ${classes.one}`}></div>
                </div>
                <div className={`${classes.match_lines} ${classes.alt}`}>
                  <div className={`${classes.line} ${classes.one}`}></div>
                </div>
              </div>
          )
          )}
          </div>
          {round.matches.length >= 2 &&
            <div className={`${classes.column_lines_wrapper}`}>
              {[...Array.from(Array(round.matches.length).keys())].map((num, i) => 
                <div 
                  className={`${(round.matches.length > 2 && (i % t === 0 || i % t === t-1)) ? i % t === 0 ? classes.column_lines_first : classes.column_lines_last : classes.column_lines}`}
                  >
                </div>)}
            </div>
          }
        </Fragment>
        )

        )}
      </div>
        <EditModal modalEditShow={modalEditShow} setEditMatchCardModalShow={setEditMatchCardModalShow} match={{}}/>
        <InfoModal modalShow={modalShow} setMatchCardModalShow={setMatchCardModalShow} match={{}}/>
    </div>
  );
};

export default SingleElimination;
