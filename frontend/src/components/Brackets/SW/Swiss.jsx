import { useState, useContext, useEffect, Fragment } from "react";
import classes from "./Swiss.module.css";
import MatchInfoIcon from "../../../assets/svg/MatchInfoIcon";
import MatchJudgeIcon from "../../../assets/svg/MatchJudgeIcon";
import InfoModal from "../Modals/InfoModal/InfoModal.jsx";
import EditModal from "../Modals/EditModal/EditModal.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentMatch, setCurrentBracketId } from "../../../store/bracket.js";
import MySortebleTable from "../../UI/SortebleTable/SortebleTable.jsx";
import { AuthContext } from "../../../context/index.js";

const Swiss = ({ bracket, bracketId }) => {
    const dispatch = useDispatch();
    const [modalShow, setMatchCardModalShow] = useState(false);
    const [modalEditShow, setEditMatchCardModalShow] = useState(false);
    const [table, setTable] = useState([]);
    const { user } = useContext(AuthContext);
    const tournament = useSelector((state) => state.tournament);
    const anonymous = useSelector((state) => state.bracket.anonymous);

    const openInfoModal = (match) => {
        setMatchCardModalShow(true);
        dispatch(setCurrentMatch({ currentMatch: match }));
    };

    const openEditModal = (match) => {
        setEditMatchCardModalShow(true);
        dispatch(setCurrentMatch({ currentMatch: match }));
        dispatch(setCurrentBracketId({ currentBracketId: bracketId }));
    };

    const createTable = (bracket) => {
        let table = [];
        bracket[0]?.matches.map((match) => {
            let draw = false;
            let max_score = Math.max(...match.info.map((participant) => participant.participant_score));
            if (
                match.info.filter((participant) => participant.participant_score == max_score).length > 1 &&
                match.state == "PLAYED"
            ) {
                draw = true;
            }

            match.info.map((i) => {
                let win_cnt = 0;
                let loose_cnt = 0;

                if (match.state == "PLAYED" && draw == false) {
                    if (i.participant_score == max_score) {
                        win_cnt = 1;
                    } else {
                        loose_cnt = 1;
                    }
                }
                table.push({
                    participant: i.participant,
                    win: win_cnt,
                    loose: loose_cnt,
                    draw: draw ? 1 : 0,
                    scores: 0 * win_cnt + 0 * loose_cnt + 0 * draw ? 1 : 0,
                });
            });
        });

        for (let round of bracket.slice(1)) {
            round?.matches?.map((match) => {
                let draw = false;
                let max_score = Math.max(...match.info.map((participant) => participant.participant_score));
                if (
                    match.info.filter((participant) => participant.participant_score == max_score).length > 1 &&
                    match.state == "PLAYED"
                ) {
                    draw = true;
                }
                console.log("heeree");

                match.info.map((i) => {
                    let win_cnt = 0;
                    let loose_cnt = 0;

                    if (match.state == "PLAYED" && draw == false) {
                        if (i.participant_score == max_score) {
                            win_cnt = 1;
                        } else {
                            loose_cnt = 1;
                        }
                    }
                    let row = table.filter((row) => row.participant == i.participant)[0];
                    if (row !== undefined) {
                        row.win += win_cnt;
                        row.loose += loose_cnt;
                        row.draw += draw ? 1 : 0;
                        row.scores += 0 * win_cnt + 0 * loose_cnt + 0 * draw ? 1 : 0;
                        console.log(i.participant);
                    }
                });
            });
        }

        return table;
    };

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
        setTable(createTable(bracket));
    }, [bracket]);

    return (
        <div>
            <div className={`${classes.bracket}`}>
                {bracket.map((round) => (
                    <Fragment>
                        <div className={`${classes.row}`}>
                            {round.matches.map((match) => (
                                <div className={`${classes.match}`}>
                                    {match.info.map((team) => (
                                        <div className={`${classes.team}`}>
                                            <div className={`${classes.name}`}>{team.participant}</div>
                                            <div className={`${classes.score}`}>{team.participant_score}</div>
                                        </div>
                                    ))}
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
                    </Fragment>
                ))}
            </div>
            <MySortebleTable table={table} columns={columns} />
            <EditModal modalEditShow={modalEditShow} setEditMatchCardModalShow={setEditMatchCardModalShow} match={{}} />
            <InfoModal modalShow={modalShow} setMatchCardModalShow={setMatchCardModalShow} match={{}} />
        </div>
    );
};

export default Swiss;
