import React, { useState, useContext, useEffect } from "react";
import {
  Seed,
  SeedItem,
  SeedTeam,
  SeedTime,
  SingleLineSeed,
} from "../Seed/seed";
import classes from "./Match.module.css";
import MyModal from "../MyModal/MyModal";
import Modal from "react-bootstrap/Modal";
import MyButton from "../MyButton/MyButton";
import useAxios from "../../../API/useAxios";
import { AuthContext } from "../../../context";
import MyRadioButton from "../MyRadioButton/MyRadioButton";
import moment from "moment";
import MatchInfoIcon from "../../../assets/svg/MatchInfoIcon";
import MatchJudgeIcon from "../../../assets/svg/MatchJudgeIcon";

const MyMatch = ({
  id,
  seed,
  onPatch,
  match_id,
  round_id,
  owner,
  single = false,
}) => {
  const [modalShow, setMatchCardModalShow] = useState(false);
  const [modalEditShow, setEditMatchCardModalShow] = useState(false);
  const [matchState, setMatchState] = useState(seed.state);
  const [matchTime, setMatchTime] = useState(seed.startTime);
  const [userOneResult, setUserOneResult] = useState(seed.teams[0].score);
  const [userTwoResult, setUserTwoResult] = useState(seed.teams[1].score);
  const { user } = useContext(AuthContext);
  const api = useAxios();



  useEffect(() => {
    setMatchState(seed.state);
    setUserOneResult(seed.teams[0].score);
    setUserTwoResult(seed.teams[1].score);
    setMatchTime(seed.startTime);
  }, [seed]);

  const hoverOnMatch = (id) => {
    const elements = document.querySelectorAll(`[id=${id}]`);
    for (let elem of elements) {
      elem.classList.remove(classes.side);
      elem.classList.add(classes.hoverSide);
    }
  };

  const hoverOffMatch = (id) => {
    const elements = document.querySelectorAll(`[id=${id}]`);
    for (let elem of elements) {
      elem.classList.remove(classes.hoverSide);
      elem.classList.add(classes.side);
    }
  };

  const matchStateHandler = (state) => {
    setMatchState(state);
  };

  const matchTimeHandler = (e) => {
    e.preventDefault();
    setMatchTime(e.target.value);
  };

  const inputUserOneResultHandler = (e) => {
    e.preventDefault();
    setUserOneResult(e.target.value);
  };

  const inputUserTwoResultHandler = (e) => {
    e.preventDefault();
    setUserTwoResult(e.target.value);
  };

  const onSubmitHandler = () => {
    const response = api
      .patch(`/update_bracket/${id}/`, {
        id: seed.id,
        startTime: matchTime,
        state: matchState,
        match_id: match_id,
        round_id: round_id,
        teams: [
          {
            id: seed.teams[0].id,
            participant: seed.teams[0].participant,
            score: userOneResult,
          },
          {
            id: seed.teams[1].id,
            participant: seed.teams[1].participant,
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
    <>
      {single ? (
        <SingleLineSeed mobileBreakpoint={992} style={{ fontSize: 14 }}>
          <div>
            {moment.parseZone(seed.startTime).format("Do MMMM h:mm a") || ""}
          </div>
          <SeedItem>
            <div
              id={`id${seed.teams[0]?.id}`}
              className={classes.side}
              onMouseEnter={(e) => {
                hoverOnMatch(`id${seed.teams[0]?.id}`);
              }}
              onMouseLeave={(e) => {
                hoverOffMatch(`id${seed.teams[0]?.id}`);
              }}
            >
              <SeedTeam>
                {seed.teams[0]?.participant || "NO TEAM "}
                <span>{seed.teams[0].score}</span>
              </SeedTeam>
            </div>
            <div
              id={`id${seed.teams[1]?.id}`}
              className={classes.side}
              onMouseEnter={(e) => {
                hoverOnMatch(`id${seed.teams[1]?.id}`);
              }}
              onMouseLeave={(e) => {
                hoverOffMatch(`id${seed.teams[1]?.id}`);
              }}
            >
              <SeedTeam>
                {seed.teams[1]?.participant || "NO TEAM "}
                <span>{seed.teams[1].score}</span>
              </SeedTeam>
            </div>
          </SeedItem>
          <div className={`${classes.buttonDiv} p-1`}>
            {user !== null && owner == user.username ? (
              <>
                <button
                  onClick={() => setMatchCardModalShow(true)}
                  className={classes.iconButton}
                >
                  <MatchInfoIcon />
                </button>
                <button
                  onClick={() => setEditMatchCardModalShow(true)}
                  className={classes.iconButton}
                >
                  <MatchJudgeIcon />
                </button>
              </>
            ) : (
              <button
                onClick={() => setMatchCardModalShow(true)}
                className={classes.iconButton}
              >
                <MatchInfoIcon />
              </button>
            )}
          </div>
        </SingleLineSeed>
      ) : (
        <Seed mobileBreakpoint={992} style={{ fontSize: 14 }}>
          <div>
            {moment.parseZone(seed.startTime).format("Do MMMM h:mm a") || ""}
          </div>
          <SeedItem>
            <div
              id={`id${seed.teams[0]?.id}`}
              className={classes.side}
              onMouseEnter={(e) => {
                hoverOnMatch(`id${seed.teams[0]?.id}`);
              }}
              onMouseLeave={(e) => {
                hoverOffMatch(`id${seed.teams[0]?.id}`);
              }}
            >
              <SeedTeam>
                {seed.teams[0]?.participant || "NO TEAM "}
                <span>{seed.teams[0].score}</span>
              </SeedTeam>
            </div>
            <div
              id={`id${seed.teams[1]?.id}`}
              className={classes.side}
              onMouseEnter={(e) => {
                hoverOnMatch(`id${seed.teams[1]?.id}`);
              }}
              onMouseLeave={(e) => {
                hoverOffMatch(`id${seed.teams[1]?.id}`);
              }}
            >
              <SeedTeam>
                {seed.teams[1]?.participant || "NO TEAM "}
                <span>{seed.teams[1].score}</span>
              </SeedTeam>
            </div>
          </SeedItem>
          <div className={`${classes.buttonDiv} p-1`}>
            {user !== null && owner == user.username ? (
              <>
                <button
                  onClick={() => setMatchCardModalShow(true)}
                  className={classes.iconButton}
                >
                  <MatchInfoIcon />
                </button>
                <button
                  onClick={() => setEditMatchCardModalShow(true)}
                  className={classes.iconButton}
                >
                  <MatchJudgeIcon />
                </button>
              </>
            ) : (
              <button
                onClick={() => setMatchCardModalShow(true)}
                className={classes.iconButton}
              >
                <MatchInfoIcon />
              </button>
            )}
          </div>
        </Seed>
      )}
      <MyModal show={modalShow} onHide={() => setMatchCardModalShow(false)}>
        <Modal.Header closeButton className={classes.myModalHeader}>
          <div className={classes.matchTitle}>
            {moment(seed.startTime).format("dddd HH:mm") || ""}
          </div>
        </Modal.Header>
        <Modal.Body className={classes.myModalBody}>
          <div className={classes.divVS}>
            <div className="row align-items-center">
              <div className="col">
                {seed.teams[0]?.participant || "NO TEAM "}
              </div>
              <div className="col"></div>
              <div className="col">
                {seed.teams[1]?.participant || "NO TEAM "}
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col">{seed.teams[0].score}</div>
              <div className="col">
                <h4>VS</h4>
              </div>
              <div className="col">{seed.teams[1].score}</div>
            </div>
          </div>
        </Modal.Body>
      </MyModal>
      <MyModal
        show={modalEditShow}
        onHide={() => setEditMatchCardModalShow(false)}
      >
        <Modal.Header closeButton className={classes.myModalHeader}>
          <div className={classes.matchTitle}>
            <input
              className={classes.dateInput}
              onChange={(e) => matchTimeHandler(e)}
              type="datetime-local"
              defaultValue={seed.startTime}
            />
          </div>
        </Modal.Header>
        <Modal.Body className={classes.myModalBody}>
          <div className={classes.divVS}>
            <div className="row align-items-center">
              <div className={`col`}>
                {seed.teams[0]?.participant || "NO TEAM "}
              </div>
              <div className="col"></div>
              <div className="col">
                {seed.teams[1]?.participant || "NO TEAM "}
              </div>
            </div>
            <div className="row align-items-center mb-4">
              <div className={`col`}>
                <input
                  className={classes.myInput}
                  onChange={(e) => inputUserOneResultHandler(e)}
                  type="text"
                  defaultValue={userOneResult}
                />
              </div>
              <div className="col">
                <h4>VS</h4>
              </div>
              <div className="col">
                <input
                  className={classes.myInput}
                  onChange={(e) => inputUserTwoResultHandler(e)}
                  type="text"
                  defaultValue={userTwoResult}
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
    </>
  );
};

export default MyMatch;
