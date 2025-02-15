import React, { useState, useContext } from "react";
import classes from "./MyRoundRobinMatch.module.css";
import MyModal from "../MyModal/MyModal";
import Modal from "react-bootstrap/Modal";
import MyButton from "../MyButton/MyButton";
import useAxios from "../../../API/useAxios";
import { useForm } from "react-hook-form";
import MyRadioButton from "../MyRadioButton/MyRadioButton";
import { AuthContext } from "../../../context";
import moment from "moment";
import MatchInfoIcon from "../../../assets/svg/MatchInfoIcon";
import MatchJudgeIcon from "../../../assets/svg/MatchJudgeIcon";
import { useSelector, useDispatch } from "react-redux";

const MyRoundRobinMatch = ({ id, match, match_id, round_id, onPatch, owner }) => {
    const [modalShow, setMatchCardModalShow] = useState(false);
    const [modalEditShow, setEditMatchCardModalShow] = useState(false);
    const [matchState, setMatchState] = useState(match.state);
    const [matchTime, setMatchTime] = useState(match.startTime);
    const [userOne, setUserOne] = useState(match.participants[0].participant);
    const [userTwo, setuserTwo] = useState(match.participants[1].participant);
    const tournament = useSelector((state) => state.tournament);
    const [userOneResult, setUserOneResult] = useState(match.participants[0].score);
    const [userTwoResult, setUserTwoResult] = useState(match.participants[1].score);
    const { user } = useContext(AuthContext);
    const api = useAxios();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ mode: "onBlur" });

    const hoverOnMatch = (id) => {
        const elements = document.querySelectorAll(`[id=${id}]`);
        for (let elem of elements) {
            elem.classList.remove(classes.side);
            elem.classList.add(classes.hoverSide);
        }
    };

    const matchStateHandler = (state) => {
        setMatchState(state);
    };

    const matchTimeHandler = (e) => {
        e.preventDefault();
        setMatchTime(e.target.value);
    };

    const inputUserOneHandler = (e) => {
        e.preventDefault();
        setUserOne(e.target.value);
    };

    const inputUserTwoHandler = (e) => {
        e.preventDefault();
        setuserTwo(e.target.value);
    };

    const inputUserOneResultHandler = (e) => {
        e.preventDefault();
        setUserOneResult(e.target.value);
    };

    const inputUserTwoResultHandler = (e) => {
        e.preventDefault();
        setUserTwoResult(e.target.value);
    };

    const hoverOffMatch = (id) => {
        const elements = document.querySelectorAll(`[id=${id}]`);
        for (let elem of elements) {
            elem.classList.remove(classes.hoverSide);
            elem.classList.add(classes.side);
        }
    };

    const onSubmitHandler = () => {
        const response = api
            .patch(`/update_bracket/${id}/`, {
                id: match.id,
                tournamentRoundText: "test",
                startTime: matchTime,
                state: matchState,
                match_id: match_id,
                round_id: round_id,
                participants: [
                    {
                        id: match.participants[0].id,
                        isWinner: userOneResult > userTwoResult && matchState == "PLAYED" ? true : false,
                        participant: match.participants[0].participant,
                        picture: null,
                        score: userOneResult,
                    },
                    {
                        id: match.participants[1].id,
                        isWinner: userOneResult < userTwoResult && matchState == "PLAYED" ? true : false,
                        participant: match.participants[1].participant,
                        picture: null,
                        score: userTwoResult,
                    },
                ],
            })
            .then(function (res) {
                onPatch(res.data.bracket);
            });
        setEditMatchCardModalShow(false);
    };

    return (
        <div className="col-3">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className={classes.topText}>
                    {moment.parseZone(match.startTime).format("Do MMMM h:mm a") || ""}
                </div>
            </div>
            <div className={classes.myMatch}>
                <div id={`id${match.participants[0].participant}`} className={classes.side}>
                    <div
                        className={classes.parName}
                        onMouseEnter={(e) => {
                            hoverOnMatch(`id${match.participants[0].participant}`);
                        }}
                        onMouseLeave={(e) => {
                            hoverOffMatch(`id${match.participants[0].participant}`);
                        }}
                    >
                        {match.participants[0].participant}
                    </div>
                    <div
                        onMouseEnter={(e) => {
                            hoverOnMatch(`id${match.participants[0].participant}`);
                        }}
                        onMouseLeave={(e) => {
                            hoverOffMatch(`id${match.participants[0].participant}`);
                        }}
                        className={classes.score}
                    >
                        {match.participants[0].score}
                    </div>
                </div>
                <div id={`id${match.participants[1].participant}`} className={classes.side}>
                    <div
                        className={classes.parName}
                        onMouseEnter={(e) => {
                            hoverOnMatch(`id${match.participants[1].participant}`);
                        }}
                        onMouseLeave={(e) => {
                            hoverOffMatch(`id${match.participants[1].participant}`);
                        }}
                    >
                        {match.participants[1].participant}
                    </div>
                    <div
                        onMouseEnter={(e) => {
                            hoverOnMatch(`id${match.participants[1].participant}`);
                        }}
                        onMouseLeave={(e) => {
                            hoverOffMatch(`id${match.participants[1].participant}`);
                        }}
                        className={classes.score}
                    >
                        {match.participants[1].score}
                    </div>
                </div>
            </div>
            <div className={`${classes.buttonDiv} p-1`}>
                {user !== null && (owner == user.username || tournament.moderators.includes(user.username)) ? (
                    <>
                        <button onClick={() => setMatchCardModalShow(true)} className={classes.iconButton}>
                            <MatchInfoIcon />
                        </button>
                        <button onClick={() => setEditMatchCardModalShow(true)} className={classes.iconButton}>
                            <MatchJudgeIcon />
                        </button>
                    </>
                ) : (
                    <button onClick={() => setMatchCardModalShow(true)} className={classes.iconButton}>
                        <MatchInfoIcon />
                    </button>
                )}
            </div>
            <MyModal show={modalShow} onHide={() => setMatchCardModalShow(false)}>
                <Modal.Header closeButton className={classes.myModalHeader}>
                    <div className={classes.matchTitle}>{match.startTime}</div>
                </Modal.Header>
                <Modal.Body className={classes.myModalBody}>
                    <div className={classes.divVS}>
                        <div className="row align-items-center">
                            <div className="col">{match.participants[0].participant}</div>
                            <div className="col"></div>
                            <div className="col">{match.participants[1].participant}</div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col">{match.participants[0].score}</div>
                            <div className="col">
                                <h4>VS</h4>
                            </div>
                            <div className="col">{match.participants[1].score}</div>
                        </div>
                    </div>
                </Modal.Body>
            </MyModal>
            <MyModal show={modalEditShow} onHide={() => setEditMatchCardModalShow(false)}>
                <Modal.Header closeButton className={classes.myModalHeader}>
                    <div className={classes.matchTitle}>
                        <input
                            className={classes.dateInput}
                            onChange={(e) => matchTimeHandler(e)}
                            type="datetime-local"
                            defaultValue={match.startTime}
                        />
                    </div>
                </Modal.Header>
                <Modal.Body className={classes.myModalBody}>
                    <div className={classes.divVS}>
                        <div className="row align-items-center">
                            <div className={`col`}>{match.participants[0].participant}</div>
                            <div className="col"></div>
                            <div className="col">{match.participants[1].participant}</div>
                        </div>
                        <div className="row align-items-center mb-4">
                            <div className={`col`}>
                                <input
                                    className={classes.myInput}
                                    onChange={(e) => inputUserOneResultHandler(e)}
                                    type="number"
                                    defaultValue={match.participants[0].score}
                                />
                            </div>
                            <div className="col">
                                <h4>VS</h4>
                            </div>
                            <div className="col">
                                <input
                                    className={classes.myInput}
                                    onChange={(e) => inputUserTwoResultHandler(e)}
                                    type="number"
                                    defaultValue={match.participants[1].score}
                                />
                            </div>
                        </div>
                        <p>Set State</p>
                        <div>
                            <MyRadioButton
                                defValue={matchState}
                                radios={[
                                    { name: "Scheduled", value: "SCHEDULED" },
                                    { name: "Played", value: "PLAYED" },
                                ]}
                                onChange={matchStateHandler}
                            />
                        </div>
                        <br />
                        <MyButton onClick={onSubmitHandler}>Submit</MyButton>
                    </div>
                </Modal.Body>
            </MyModal>
        </div>
    );
};

export default MyRoundRobinMatch;
