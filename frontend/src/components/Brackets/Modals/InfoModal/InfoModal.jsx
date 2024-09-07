import MyModal from "../../../UI/MyModal/MyModal";
import Modal from "react-bootstrap/Modal";
import classes from "./InfoModal.module.css";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";


const InfoModal = ({modalShow, setMatchCardModalShow}) => {
    const match = useSelector(state => state.bracket.currentMatch)

    return (
            <MyModal
                show={modalShow}
                onHide={() => setMatchCardModalShow(false)}
            >
            <Modal.Header closeButton className={classes.myModalHeader}>
            <div className={classes.matchTitle}>
                {match?.startTime && 
                  <span>{moment.parseZone(match?.startTime).format("DD.MM h:mm a") || ""}</span>
                }   
            </div>
            </Modal.Header>
            <Modal.Body className={classes.myModalBody}>
            <div className={classes.divVS}>
                <div className="row align-items-center">
                <div className="col">
                    {match?.info[0]?.participant || "NO TEAM "}
                </div>
                <div className="col"></div>
                <div className="col">
                    {match?.info[1]?.participant || "NO TEAM "}
                </div>
                </div>
                <div className="row align-items-center">
                <div className="col">{match?.info[0]?.participant_scoore}</div>
                <div className="col">
                    <h4>VS</h4>
                </div>
                <div className="col">{match?.info[1]?.participant_scoore}</div>
                </div>
            </div>
            </Modal.Body>
        </MyModal>
    );
};

export default InfoModal;