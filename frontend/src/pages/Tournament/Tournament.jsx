import React, { useEffect, useState, useContext, Fragment } from "react";
import { useParams } from "react-router-dom";
import { useFetching } from "../../hooks/useFetching";
import Loader from "../../components/UI/Loader/Loader";
import useAxios from "../../API/useAxios";
import { AuthContext } from "../../context";
import { useNavigate } from "react-router-dom";
import MyButton from "../../components/UI/MyButton/MyButton";
import Accordion from "react-bootstrap/Accordion";
import moment from "moment";
import ModeratorSettings from "../../components/ModeratorsSettings/ModeratorSettings.jsx";
import classes from "./Tournament.module.css";
import DefaultTournamnetPoster from "../../assets/svg/DefaultTournamnetPoster";
import BracketController from "../../components/BracketController/BracketController.jsx";

import { setTournament } from "../../store/tournament";
import { setBracket } from "../../store/bracket";
import { useSelector, useDispatch } from "react-redux";
import { followTournament, unFollowTournament, setTournamnetSubscriptions } from "../../store/user.js";

import bracketApi from "../../services/api/bracketApi";
import tournamentApi from "../../services/api/tournamentApi.js";
import profileApi from "../../services/api/profileApi.js";
import axios from "axios";

const Tournament = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const api = useAxios();
    const public_api = axios;
    const navigate = useNavigate();

    const [id, setId] = useState(0);
    const [types, setTypes] = useState("");
    const [groupStage, setGroupStage] = useState([]);

    const tournament = useSelector((state) => state.tournament);
    const bracket = useSelector((state) => state.bracket);

    const { user } = useContext(AuthContext);

    const userSlice = useSelector((state) => state.user);

    const [fetchTournament, isLoading, error] = useFetching(async (link) => {
        const response = await tournamentApi.getTournamentBySlug(public_api, link);
        dispatch(setTournament(response.data));
    });

    const [fetchBrackets, isBraLoadind, braError] = useFetching(async () => {
        const response = await bracketApi.getBrackets(public_api, tournament.id);
        dispatch(setBracket({ brackets: response.data }));
    });

    const onDelete = async () => {
        const response = await api.delete(`/delete_tournament/${params.link}/`).then(function (response) {
            if (response.status == 204) {
                navigate(`/tournaments`);
            }
        });
    };

    const onEdit = async () => {
        navigate(`/edit_tournament/${params.link}/`);
    };

    useEffect(() => {
        if (user) {
            profileApi.getSubscriptionsBySlug(api).then((response) => {
                dispatch(setTournamnetSubscriptions({ subscriptions: response.data.subscriptions }));
            });
        }
        fetchTournament(params.link);
    }, []);

    useEffect(() => {
        if (tournament.id) {
            fetchBrackets();
        }
    }, [tournament.id]);

    useEffect(() => {}, [bracket]);

    const copyToClipboard = () => {
        const currentUrl = window.location.href;

        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(currentUrl)
                .then(() => {})
                .catch((err) => {});
        } else {
            // Fallback для старых браузеров
            const textArea = document.createElement("textarea");
            textArea.value = currentUrl;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
            } catch (err) {}
            document.body.removeChild(textArea);
        }
    };

    const followHandler = () => {
        let data = {
            tournament_id: tournament.id,
        };
        profileApi.createSubscription(api, data).then(() => {
            dispatch(followTournament({ subscriptions: tournament.id }));
        });
    };

    const unFollowHandler = () => {
        let data = {
            tournament_id: tournament.id,
        };
        profileApi.deleteSubscription(api, { headers: {}, data: data }).then(() => {
            dispatch(unFollowTournament({ subscriptions: tournament.id }));
        });
    };

    return (
        <section>
            {isLoading ? (
                <div className="loader">
                    <Loader />
                </div>
            ) : (
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className="row">
                                <div className={`${classes.tournament_img_container} col-sm-8 mb-3`}>
                                    {tournament.poster == null ? (
                                        <div className={`${classes.tournament_default}`}>
                                            <DefaultTournamnetPoster />
                                        </div>
                                    ) : (
                                        <img
                                            src={tournament.poster}
                                            className={`${classes.tournament_img}`}
                                            alt="card text"
                                        />
                                    )}
                                </div>
                                <div className={`${classes.tournament_info_container} col-sm-4`}>
                                    <div className={`${classes.tournament_info_container}`}>
                                        <h2 className="tournament_text">{tournament.title}</h2>
                                        <p>Start of the tournament</p>
                                        <p className="tournament_text">
                                            {moment(tournament.start_time).format(" Do MMMM  YYYY, hh:mm") || ""}
                                        </p>
                                        <p>Game</p>
                                        <p className="tournament_text">{tournament.game}</p>
                                        <div className={`${classes.tournament_block}`}>
                                            <p>Organizer</p>
                                            <p className="tournament_text ">{tournament.owner}</p>
                                        </div>
                                        <div className={`${classes.tournament_button_block}`}>
                                            {userSlice.subscriptions?.includes(tournament.id) ? (
                                                <MyButton
                                                    onClick={() => {
                                                        unFollowHandler();
                                                    }}
                                                    additionalCl={`${classes.follow_button} me-3`}
                                                >
                                                    Unfollow
                                                </MyButton>
                                            ) : (
                                                <MyButton
                                                    onClick={() => {
                                                        followHandler();
                                                    }}
                                                    additionalCl={`${classes.follow_button} me-3`}
                                                >
                                                    Follow
                                                </MyButton>
                                            )}

                                            <MyButton
                                                onClick={() => {
                                                    copyToClipboard();
                                                }}
                                                additionalCl={`${classes.follow_button}`}
                                            >
                                                Copy link
                                            </MyButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row my-3">
                                <div className="col">
                                    <Accordion flush defaultActiveKey={["1"]} alwaysOpen>
                                        {user?.username == tournament.owner && (
                                            <Accordion.Item eventKey="2">
                                                <Accordion.Header className="my_accordion_body">
                                                    <h4>Settings</h4>
                                                </Accordion.Header>
                                                <Accordion.Body className="my_accordion_body">
                                                    <ModeratorSettings />
                                                    <>
                                                        <MyButton
                                                            additionalCl={`${classes.setting_button} btn-md btn my-3 me-3`}
                                                            type="submit"
                                                            onClick={onEdit}
                                                        >
                                                            Edit Tournament
                                                        </MyButton>
                                                        <MyButton
                                                            additionalCl={`${classes.setting_button} btn-md btn my-3 me-3`}
                                                            type="submit"
                                                            onClick={onDelete}
                                                        >
                                                            Delete Tournament
                                                        </MyButton>
                                                    </>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        )}
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header className="my_accordion_body">
                                                <h4>Description</h4>
                                            </Accordion.Header>
                                            <Accordion.Body className="my_accordion_body">
                                                <p>{tournament.content}</p>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header className="my_accordion_body">
                                                <h4>Bracket</h4>
                                            </Accordion.Header>
                                            <Accordion.Body className="my_accordion_body">
                                                {isBraLoadind ? (
                                                    <div className="loader">
                                                        <Loader />
                                                    </div>
                                                ) : (
                                                    <BracketController />
                                                )}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Tournament;
