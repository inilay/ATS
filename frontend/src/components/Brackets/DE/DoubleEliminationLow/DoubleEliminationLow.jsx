import { useState, useContext, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/index.js";
import MatchInfoIcon from "../../../../assets/svg/MatchInfoIcon";
import MatchJudgeIcon from "../../../../assets/svg/MatchJudgeIcon";
import classes from "./DoubleEliminationLow.module.css";
import InfoModal from "../../Modals/InfoModal/InfoModal.jsx";
import EditModal from "../../Modals/EditModal/EditModal.jsx";
import { setCurrentMatch, setCurrentBracketId } from "../../../../store/bracket.js";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

const DoubleEliminationLow = ({ bracket, bracketId }) => {
    const dispatch = useDispatch();
    const [modalShow, setMatchCardModalShow] = useState(false);
    const [modalEditShow, setEditMatchCardModalShow] = useState(false);
    const participantsInMatch = bracket[0]?.matches[0]?.info.length;

    const { user } = useContext(AuthContext);
    const anonymous = useSelector((state) => state.bracket.anonymous);
    const tournament = useSelector((state) => state.tournament);

    const openInfoModal = (match) => {
        setMatchCardModalShow(true);
        dispatch(setCurrentMatch({ currentMatch: match }));
    };

    const openEditModal = (match) => {
        setEditMatchCardModalShow(true);
        dispatch(setCurrentMatch({ currentMatch: match }));
        dispatch(setCurrentBracketId({ currentBracketId: bracketId }));
    };

    const isNumberInSequence = (num) =>{
        if (num < 1) {
          return false; 
        }
        return (num - 1) % 4 !== 0;
      }

    return (
        <div>
            <div className={`${classes.bracket}`}>
                {bracket.map((round) => (
                    <Fragment>
                        <div className={`${classes.column}`}>
                            {round.matches.map((match) => (
                                <div className={`${classes.match}`}>
                                    <div className={classes.button_container}>
                                        {match?.startTime && (
                                            <span>
                                                {moment.parseZone(match?.startTime).format("DD.MM h:mm a") || ""}
                                            </span>
                                        )}
                                    </div>
                                    {match.info.map((team) => (
                                        <div className={`${classes.team}`}>
                                            <div className={`${classes.name}`}>{team.participant}</div>
                                            <div className={`${classes.score}`}>{team.participant_score}</div>
                                        </div>
                                    ))}
                                    <div className={`${classes.match_lines}`}>
                                        <div className={`${classes.line} ${classes.one}`}></div>
                                    </div>
                                    <div className={`${classes.match_lines} ${classes.alt}`}>
                                        <div className={`${classes.line} ${classes.one}`}></div>
                                    </div>
                                    <div className={classes.button_container}>
                                        {(user !== null &&
                                            (tournament.owner == user.username ||
                                                tournament.moderators.includes(user.username))) ||
                                        anonymous ? (
                                            <Fragment>
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
                                            </Fragment>
                                        ) : (
                                            <button
                                                className={classes.icon_button}
                                                onClick={() => openInfoModal(match)}
                                            >
                                                <MatchInfoIcon />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {round.matches.length >= 2 && (
                            <div className={`${classes.column_lines_wrapper}`}>
                                {isNumberInSequence(round.serial_number) && [...Array.from(Array(round.matches.length).keys())].map((num, i) =>
                                    participantsInMatch % 2 === 1 ? (
                                        <div
                                            className={`${round.matches.length > 2 && (i % participantsInMatch === 0 || i % participantsInMatch === participantsInMatch - 1) ? (i % participantsInMatch === 0 ? classes.column_lines_first_odd : classes.column_lines_last_odd) : classes.column_lines_odd}`}
                                        ></div>
                                    ) : (
                                        <div
                                            className={`${round.matches.length > 2 && (i % participantsInMatch === 0 || i % participantsInMatch === participantsInMatch - 1) ? (i % participantsInMatch === 0 ? classes.column_lines_first : classes.column_lines_last) : classes.column_lines}`}
                                        ></div>
                                    ),
                                )}
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
            <EditModal modalEditShow={modalEditShow} setEditMatchCardModalShow={setEditMatchCardModalShow} match={{}} />
            <InfoModal modalShow={modalShow} setMatchCardModalShow={setMatchCardModalShow} match={{}} />
        </div>
    );
};

export default DoubleEliminationLow;
