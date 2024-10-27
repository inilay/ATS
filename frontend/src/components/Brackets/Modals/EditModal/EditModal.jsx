import Modal from "react-bootstrap/Modal";
import MyButton from "../../../UI/MyButton/MyButton";
import MyModal from "../../../UI/MyModal/MyModal";
import MyRadioButton from "../../../UI/MyRadioButton/MyRadioButton";
import classes from "./EditModal.module.css";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, Fragment } from "react";
import moment from "moment";
import bracketApi from "../../../../services/api/bracketApi";

const EditModal = ({modalEditShow, setEditMatchCardModalShow}) => {
    const bracket = useSelector(state => state.bracket)
    const match = useSelector(state => state.bracket.currentMatch)
    const participantCount = match?.info.length

    const [matchState, setMatchState] = useState(match?.state);
    const [matchTime, setMatchTime] = useState(match?.startTime);
    const [matchResults, setMatchResults] = useState([]);
    

    const matchStateHandler = (state) => {
        setMatchState(state);
      };
    
    const matchTimeHandler = (e) => {
        e.preventDefault();
        setMatchTime(e.target.value);
    };

    const matchResultsHandler = (e, id) => {
        e.preventDefault();
        let _matchResults = matchResults;
        if  (!_matchResults.some(o => o.participant === e.target.name)) {
            setMatchResults([...matchResults, {'id': id, 'participant': e.target.name, 'score': e.target.value}]);
        }
        else {
            _matchResults.find(item => {
                if (item.id === id) {
                    item.score = e.target.value;
                    return true;
                }
            });
            setMatchResults(_matchResults)
        }
    };

    const onSubmitHandler = () => {

        console.log('match_results', matchResults);

        let data = {
            bracket_id: bracket.currentBracketId,
            match_id: match.id,
            start_time: matchTime,
            state: matchState,
            match_results: matchResults.reduce((res, cur) => ({ ...res, [cur.id]: {score: cur.score, participant: cur.participant}}), {})
        }

        console.log(data);
        

        const response = bracketApi.updateBracket(data).then(() => {
            setEditMatchCardModalShow(false);
        });
        
    };

    return (
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
                    defaultValue={match?.startTime}
                />
            </div>
            </Modal.Header>
            <Modal.Body className={classes.myModalBody}>
            <div className={classes.divVS}>
                <div className="row align-items-center">
                    <div className="col mb-4">
                        <h4>Participant</h4>
                    </div>
                    <div className="col mb-4">
                        <h4>Score</h4>
                    </div>
                </div>
                {match?.info.map((p, i) =>
                    <div className="mb-2">
                        <div className="row align-items-center">
                            <div className="col">
                                {p?.participant || "NO TEAM "}
                            </div>
                            <div className="col">
                            <input
                                name={p?.participant}
                                className={classes.myInput}
                                onChange={(e) => matchResultsHandler(e, p.id)}
                                type="text"
                            />
                            </div>
                        </div>
                        {i != participantCount-1 &&
                            <div className="row">
                                <h4>VS</h4>
                            </div>
                        }
                        {i != participantCount-1 && <div ></div>}
                    </div>
                )}
                <p>Set State</p>
                <div>
                <MyRadioButton
                    defValue={match?.state}
                    radios={[
                        { name: "Scheduled", value: 'SCHEDULED' },
                        { name: "Played", value: 'PLAYED' },
                    ]}
                    onChange={matchStateHandler}
                />
                </div>
                <br />
                <MyButton onClick={onSubmitHandler}>Submit</MyButton>
            </div>
            </Modal.Body>
        </MyModal>
    )
};

export default EditModal;
