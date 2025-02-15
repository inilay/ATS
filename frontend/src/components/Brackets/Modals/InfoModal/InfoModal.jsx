import MyModal from "../../../UI/MyModal/MyModal";
import Modal from "react-bootstrap/Modal";
import classes from "./InfoModal.module.css";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Fragment } from "react";

const InfoModal = ({ modalShow, setMatchCardModalShow }) => {
    const match = useSelector((state) => state.bracket.currentMatch);
    const participantCount = match?.info.length;
    return (
        <MyModal show={modalShow} onHide={() => setMatchCardModalShow(false)}>
            <Modal.Header closeButton className={classes.myModalHeader}>
                <div className={classes.matchTitle}>
                    {match?.start_time && (
                        <span>{moment.parseZone(match?.start_time).format("DD.MM.YY h:mm a") || ""}</span>
                    )}
                </div>
            </Modal.Header>
            <Modal.Body className={classes.myModalBody}>
                <div className={classes.divVS}>
                    <div className="row ">
                        <div className="row align-items-center">
                            <div className="col mb-4">
                                <h4>Participant</h4>
                            </div>
                            <div className="col mb-4">
                                <h4>Score</h4>
                            </div>
                        </div>
                        {match?.info.map((p, i) => (
                            <Fragment>
                                <div className="row align-items-center">
                                    <div className="col">{p?.participant || "NO TEAM "}</div>
                                    <div className="col">{p?.participant_score}</div>
                                </div>
                                {i != participantCount - 1 && (
                                    <div className="row">
                                        <h4>VS</h4>
                                    </div>
                                )}
                                {i != participantCount - 1 && <div></div>}
                            </Fragment>
                        ))}
                    </div>
                </div>
            </Modal.Body>
        </MyModal>
    );
};

export default InfoModal;
