import Modal from "react-bootstrap/Modal";
import MyButton from "../../../UI/MyButton/MyButton";
import MyModal from "../../../UI/MyModal/MyModal";
import MyRadioButton from "../../../UI/MyRadioButton/MyRadioButton";
import classes from "./EditModal.module.css";
import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import moment from "moment";
import bracketApi from "../../../../services/api/bracketApi";

const EditModal = ({modalEditShow, setEditMatchCardModalShow}) => {
    const match = useSelector(state => state.bracket.currentMatch)

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

    const matchResultsHandler = (e) => {
        e.preventDefault();
        let _matchResults = matchResults;
        if  (!_matchResults.some(o => o.participant === e.target.name)) {
            setMatchResults([...matchResults, {'participant': e.target.name, 'score': e.target.value}]);
        }
        else {
            _matchResults.find(item => {
                if (item.participant === e.target.name) {
                    item.score = e.target.value;
                    return true;
                }
            });
            setMatchResults(_matchResults)
        }
    };

    const onSubmitHandler = () => {
        let data = {
            id: match.id,
            start_time: matchTime,
            state: matchState,
            match_results: matchResults
        }

        console.log(data);
        

        const response = bracketApi.updateBracket(1, data).then(() => {
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
                <div className={`col`}>
                    {match?.info[0]?.participant || "NO TEAM "}
                </div>
                <div className="col"></div>
                <div className="col">
                    {match?.info[1]?.participant || "NO TEAM "}
                </div>
                </div>
                <div className="row align-items-center mb-4">
                <div className={`col`}>
                    <input
                        name={match?.info[0]?.participant}
                        className={classes.myInput}
                        onChange={(e) => matchResultsHandler(e)}
                        type="text"
                    //   defaultValue={userOneResult}
                    />
                </div>
                <div className="col">
                    <h4>VS</h4>
                </div>
                <div className="col">
                    <input
                        name={match?.info[1]?.participant}
                        className={classes.myInput}
                        onChange={(e) => matchResultsHandler(e)}
                        type="text"
                    //   defaultValue={userTwoResult}
                    />
                </div>
                </div>
                <p>Set State</p>
                <div>
                <MyRadioButton
                    defValue={matchState}
                    radios={[
                        { name: "Scheduled", value: '1' },
                        { name: "Played", value: '2' },
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
