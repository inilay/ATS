import { useState, useContext, Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import MatchInfoIcon from "../../../assets/svg/MatchInfoIcon";
import MatchJudgeIcon from "../../../assets/svg/MatchJudgeIcon";
import classes from "./RoundRobin.module.css";
import InfoModal from "../Modals/InfoModal/InfoModal.jsx";
import EditModal from "../Modals/EditModal/EditModal.jsx";
import { setCurrentMatch, setCurrentBracketId } from "../../../store/bracket.js";
import { useSelector, useDispatch } from "react-redux";
import MySortebleTable from "../../UI/SortebleTable/SortebleTable.jsx";

const RoundRobin = ({bracket, bracketId}) => {
  const dispatch = useDispatch()
  const [modalShow, setMatchCardModalShow] = useState(false);
  const [modalEditShow, setEditMatchCardModalShow] = useState(false);
  const [table, setTable] = useState([]);

  console.log('bracket rr', bracket);

  const openInfoModal = (match) => {  
    setMatchCardModalShow(true)
    dispatch(setCurrentMatch({currentMatch: match}))

  }
  
  const openEditModal = (match) => {  
    setEditMatchCardModalShow(true)
    dispatch(setCurrentMatch({currentMatch: match}))
    dispatch(setCurrentBracketId({currentBracketId: bracketId}))

  }

  const creeateTable = (bracket) => {
    let table = []
    console.log('bracket', bracket);
    bracket[0]?.matches.map((match) => {
      match.info.map((i) => {
        if (match.state == "PLAYED") {
          
        }
        table.push({participant: i.participant, win: 0, loose: 0, draw: 0, scores: 0})
        console.log(i.participant);
        
      })
    })
    return table
  }

  const columns = [
    { label: "Participant", accessor: "participant", sortable: true },
    // { label: "Match W-L", accessor: "match_w_l", sortable: false },
    { label: "Set win", accessor: "win", sortable: true },
    { label: "Set loose", accessor: "loose", sortable: true },
    { label: "Set draw", accessor: "draw", sortable: true },
    // { label: "Berger", accessor: "berger", sortable: true },
    {
      label: "Scores",
      accessor: "scores",
      sortable: true,
      sortbyOrder: "desc",
    },
  ];

  useEffect(() => {
    setTable(creeateTable(bracket))
  }, [bracket])

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
      <MySortebleTable table={table} columns={columns} />
      <EditModal modalEditShow={modalEditShow} setEditMatchCardModalShow={setEditMatchCardModalShow} match={{}}/>
      <InfoModal modalShow={modalShow} setMatchCardModalShow={setMatchCardModalShow} match={{}}/>
    </div>
  );
};

export default RoundRobin;
