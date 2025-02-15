import React, { useState, useEffect, Fragment } from "react";
import classes from "./ModeratorSettings.module.css";
import tournamentApi from "../../services/api/tournamentApi";
import useAxios from "../../API/useAxios";
import { useSelector, useDispatch } from "react-redux";
import { addModerator, deleteModerator } from "../../store/tournament";
import MyButton from "../UI/MyButton/MyButton";

const ModeratorSettings = () => {
    const api = useAxios();
    const [username, setUserName] = useState("");
    const tournament = useSelector((state) => state.tournament);
    const dispatch = useDispatch();

    const deleteModeratorHandler = (username) => {
        let data = {
            tournament_id: tournament.id,
            username: username,
        };

        const reponse = tournamentApi.deleteModerator(api, { headers: {}, data: data }).then(() => {
            dispatch(deleteModerator({ moderator: username }));
        });
    };

    const addModeratorHandler = () => {
        let data = {
            tournament_id: tournament.id,
            username: username,
        };

        const reponse = tournamentApi.createModerator(api, data).then(() => {
            dispatch(addModerator({ moderator: username }));
        });
    };

    return (
        <div className={`${classes.modaretor_container} row`}>
            {tournament.moderators.length > 0 && (
                <Fragment>
                    <h5>Moderator list</h5>
                    <ul className={`${classes.moderators_container} list-group list-group-flush mb-4`}>
                        {tournament.moderators?.map((username) => (
                            <li
                                className={`${classes.moderators_container} list-group-item d-flex justify-content-between align-items-start`}
                            >
                                <div class="me-auto">{username}</div>
                                <div
                                    onClick={() => {
                                        deleteModeratorHandler(username);
                                    }}
                                    className={`${classes.close} row`}
                                ></div>
                            </li>
                        ))}
                    </ul>
                </Fragment>
            )}
            <h5>Add moderator</h5>
            <div className={`${classes.add_moderator_container}`}>
                <input
                    type="text"
                    className={`${classes.add_moderator_input}`}
                    placeholder="Username"
                    aria-label="Recipient's username with two button addons"
                    value={username}
                    onChange={(e) => {
                        setUserName(e.target.value);
                    }}
                ></input>
                <MyButton
                    onClick={(e) => addModeratorHandler(e)}
                    additionalCl={`${classes.add_moderator_button}`}
                    type="button"
                >
                    Add
                </MyButton>
            </div>
        </div>
    );
};

export default ModeratorSettings;
