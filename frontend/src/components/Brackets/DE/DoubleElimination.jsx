import { useState, useContext, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import MatchInfoIcon from "../../../assets/svg/MatchInfoIcon";
import MatchJudgeIcon from "../../../assets/svg/MatchJudgeIcon";
import classes from "./DoubleElimination.module.css";
import InfoModal from "../Modals/InfoModal/InfoModal.jsx";
import EditModal from "../Modals/EditModal/EditModal.jsx";
import { setCurrentMatch, setCurrentBracketId } from "../../../store/bracket.js";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import SingleElimination from "../SE/SingleElimination.jsx";
import DoubleEliminationLow from "./DoubleEliminationLow/DoubleEliminationLow.jsx";


const DoubleElimination = ({ bracket, bracketId }) => {
    const dispatch = useDispatch();
    // const [modalShow, setMatchCardModalShow] = useState(false);
    // const [modalEditShow, setEditMatchCardModalShow] = useState(false);
    // const participantsInMatch = bracket[0].matches[0].info.length

    // const openInfoModal = (match) => {
    //   setMatchCardModalShow(true)
    //   dispatch(setCurrentMatch({currentMatch: match}))

    // }

    // const openEditModal = (match) => {
    //   setEditMatchCardModalShow(true)
    //   dispatch(setCurrentMatch({currentMatch: match}))
    //   dispatch(setCurrentBracketId({currentBracketId: bracketId}))

    // }
    console.log(bracket.filter((obj) => obj.serial_number % 2 === 0));
    return (
        <div>
            <SingleElimination bracket={bracket.filter((obj) => obj.serial_number % 2 === 0)} bracketId={bracketId} />
            <DoubleEliminationLow bracket={bracket.filter((obj) => obj.serial_number % 2 === 1)} bracketId={bracketId} />
            {/* <EditModal modalEditShow={modalEditShow} setEditMatchCardModalShow={setEditMatchCardModalShow} match={{}}/>
        <InfoModal modalShow={modalShow} setMatchCardModalShow={setMatchCardModalShow} match={{}}/> */}
        </div>
    );
};

export default DoubleElimination;
