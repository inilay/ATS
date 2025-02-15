import React, { useState, useContext, Fragment, useEffect } from "react";
import "../../styles/App.css";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context";
import useAxios from "../../API/useAxios";
import { useForm } from "react-hook-form";
import MyFormGroupInput from "../../components/UI/MyFormGroupInput/MyFormGroupInput";
import MyButton from "../../components/UI/MyButton/MyButton";
import MyCard from "../../components/UI/MyCard/MyCard";
import classes from "./CreateTournament.module.css";
import TournamentInfoInput from "./TournamentInfoInput/TournamentInfoInput.jsx";
import tournamentApi from "../../services/api/tournamentApi.js";

const CreateTournament = () => {
    const api = useAxios();
    const [inputFile, setInputFile] = useState(null);
    const [tournamentType, setTournamentType] = useState("0");
    const [privateTournament, setPrivateTournamnet] = useState(false);
    const [error, setError] = useState("");

    const [participants, setParticipants] = useState("");
    // const [advancesNext, setAdvancesNext] = useState(1);
    // const [participantInMatch, setParticipantInMatch] = useState("");

    const SeParticipantOptions = ["2", "3", "4", "5", "6"];
    const SWParticipantOptions = ["2", "3", "4", "5", "6"];
    const DeParticipantOptions = ["2", "4", "6"];

    const SeAdvanceOptions = {
        2: ["1"],
        3: ["1"],
        4: ["1", "2"],
        5: ["1"],
        6: ["1", "2", "3"],
    };

    const [responseBody, setResponseBody] = useState({
        bracket_type: 1,
        advances_to_next: 1,
        participant_in_match: 2,

        points_loss: 0,
        points_draw: 0,
        points_victory: 1,

        tournament_type: tournamentType,

        group_type: 5,
        participant_in_group: 4,
        advance_from_group: 2,
    });

    const inputChangeHandler = (inputValue) => {
        const { name, value } = inputValue;
        setResponseBody({ ...responseBody, [name]: value });
        setValue(name, value);
    };

    const inputSelectChangeHandler = (event) => {
        const { name, value } = event.target;

        if (
            (name == "participant_in_match" &&
                !SeAdvanceOptions[value].includes(parseInt(responseBody.advances_to_next))) ||
            name == "bracket_type"
        ) {
            setResponseBody({ ...responseBody, advances_to_next: 1, [name]: parseInt(value) });
        } else {
            setResponseBody({ ...responseBody, [name]: parseInt(value) });
        }
    };

    const inputRadioChangeHandler = (event) => {
        const { name, value } = event.target;
        setTournamentType(event.target.value);

        setResponseBody({ ...responseBody, [name]: event.target.value });
    };

    const inputCheckBoxChangeHandler = (e) => {
        const { target } = e;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const { name } = target;
        setResponseBody({ ...responseBody, [name]: value });
    };

    const participantsHandler = (e) => {
        setParticipants(e.value);
        setValue("participants", e.value);
    };

    const countNonEmptyRows = () => {
        const text = participants;
        const lines = text.split("\n");
        const nonEmptyLines = lines.filter((line) => line.trim() !== "");
        const count = nonEmptyLines.length;

        let maxNumber = (responseBody?.bracket_type == 3 ? 20 : 256) || 256;
        let minNumber = responseBody?.participant_in_match * 2 || 2;

        if (count < minNumber) {
            return `⚠ Minimum number of participants ${minNumber}.`;
        } else if (count > maxNumber) {
            return `⚠ Maximum number of participants ${maxNumber}.`;
        }
    };

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onBlur" });

    const onSubmitHandler = () => {
        setError("");
        setResponseBody({ ...responseBody, poster: inputFile });
        console.log({ ...responseBody, poster: inputFile });
        let data = { ...responseBody, poster: inputFile, participants: participants, private: privateTournament };
        const response = tournamentApi
            .createTournament(api, data)
            .then(function (response) {
                if (response.status == 201) {
                    // navigate(`/tournament/${responseBody.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}`)
                }
            })
            .catch((error) => {
                setError(error?.response?.data?.detail?.error);
            });
    };

    useEffect(() => {
        setResponseBody({ ...responseBody, participant_in_match: 2 });
    }, [responseBody.bracket_type]);

    return (
        <section>
            <div className={`${classes.create_tournament_form}`}>
                <Form onSubmit={handleSubmit(onSubmitHandler)}>
                    <TournamentInfoInput
                        errors={errors}
                        register={register}
                        inputChangeHandler={inputChangeHandler}
                        setInputFile={setInputFile}
                        inputRadioChangeHandler={inputRadioChangeHandler}
                        tournamentType={tournamentType}
                        privateTournament={privateTournament}
                        setPrivateTournamnet={setPrivateTournamnet}
                    />
                    <div className="my-4">
                        <MyCard>
                            <Card.Header className="card-header-text">Bracket Info</Card.Header>
                            <Card.Body>
                                {tournamentType === "1" ? (
                                    <>
                                        <div>
                                            <p>Group stage</p>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Bracket type</Form.Label>
                                                <Form.Select
                                                    className="shadow-none select-input"
                                                    name="group_type"
                                                    onChange={(e) => inputSelectChangeHandler(e)}
                                                >
                                                    <option value="5">Single Elimination</option>
                                                    <option value="6">Double Elimination</option>
                                                    <option value="7">Round Robin</option>
                                                    <option value="8">Swiss</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <div className="row">
                                                <div className="col">
                                                    <MyFormGroupInput
                                                        label="Compete in each group"
                                                        name="participant_in_group"
                                                        errors={errors}
                                                        defaultValue={4}
                                                        register={register}
                                                        validationSchema={{
                                                            required: "⚠ This input is required.",
                                                        }}
                                                        onChange={inputChangeHandler}
                                                    ></MyFormGroupInput>
                                                </div>
                                                <div className="col">
                                                    <MyFormGroupInput
                                                        label="Advance from each group — power of 2 for single & double"
                                                        name="advance_from_group"
                                                        errors={errors}
                                                        defaultValue={2}
                                                        register={register}
                                                        validationSchema={{
                                                            required: "⚠ This input is required.",
                                                        }}
                                                        onChange={inputChangeHandler}
                                                    ></MyFormGroupInput>
                                                </div>
                                            </div>
                                        </div>
                                        <p>Final stage</p>
                                    </>
                                ) : (
                                    <></>
                                )}
                                {/* One stage */}
                                <Form.Group className="mb-3">
                                    <Form.Label className={`${classes.myFormLabel}`}>Bracket type</Form.Label>
                                    <Form.Select
                                        className="shadow-none select-input"
                                        name="bracket_type"
                                        onChange={(e) => inputSelectChangeHandler(e)}
                                    >
                                        <option value="1">Single Elimination</option>
                                        <option value="2">Double Elimination</option>
                                        <option value="3">Round Robin</option>
                                        <option value="4">Swiss</option>
                                    </Form.Select>
                                </Form.Group>
                                {/* Additional settings */}
                                {tournamentType === "0" && (
                                    <div class="accordion mb-3" id="accordionExtend">
                                        <div class="accordion-item">
                                            <h2 class="accordion-header">
                                                <MyButton
                                                    additionalCl={classes.editional_settings_btn}
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseOne"
                                                    aria-expanded="true"
                                                    aria-controls="collapseOne"
                                                >
                                                    Additional settings
                                                </MyButton>
                                            </h2>
                                            <div
                                                id="collapseOne"
                                                class="accordion-collapse collapse"
                                                data-bs-parent="#accordionExtend"
                                            >
                                                {/* SE and DE bracket */}
                                                {responseBody.bracket_type == 1 || responseBody.bracket_type == 2 ? (
                                                    <div className="row">
                                                        <div className="col">
                                                            <Form.Label className={`${classes.myFormLabel}`}>
                                                                Participant in match
                                                            </Form.Label>
                                                            <Form.Select
                                                                className="shadow-none select-input"
                                                                name="participant_in_match"
                                                                onChange={(e) => inputSelectChangeHandler(e)}
                                                            >
                                                                {responseBody.bracket_type == 1 &&
                                                                    SeParticipantOptions.map((value) => (
                                                                        <option value={value}>{value}</option>
                                                                    ))}
                                                                {responseBody.bracket_type == 2 &&
                                                                    DeParticipantOptions.map((value) => (
                                                                        <option value={value}>{value}</option>
                                                                    ))}
                                                            </Form.Select>
                                                        </div>
                                                        <div className="col">
                                                            {responseBody.bracket_type == 1 && (
                                                                <Fragment>
                                                                    <Form.Label className={`${classes.myFormLabel}`}>
                                                                        Advances to next match
                                                                    </Form.Label>
                                                                    <Form.Select
                                                                        className="shadow-none select-input"
                                                                        name="advances_to_next"
                                                                        onChange={(e) => inputSelectChangeHandler(e)}
                                                                    >
                                                                        {responseBody.bracket_type == 1 &&
                                                                            SeAdvanceOptions[
                                                                                responseBody?.participant_in_match
                                                                            ].map((value) => (
                                                                                <option value={value}>{value}</option>
                                                                            ))}
                                                                    </Form.Select>
                                                                    {/* <MyFormGroupInput
                                  label="Advances to next match"
                                  name="advances_to_next"
                                  defaultValue={1}
                                  errors={errors}
                                  register={register}
                                  onChange={inputChangeHandler}
                                >
                                </MyFormGroupInput> */}
                                                                </Fragment>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // For SW and RR brackets
                                                    <Fragment>
                                                        {/* Only for SW */}
                                                        {responseBody.bracket_type == 4 && (
                                                            <div className="row">
                                                                <div className="col">
                                                                    <Form.Label className={`${classes.myFormLabel}`}>
                                                                        Participant in match
                                                                    </Form.Label>
                                                                    <Form.Select
                                                                        className="shadow-none select-input"
                                                                        name="participant_in_match"
                                                                        onChange={(e) => inputSelectChangeHandler(e)}
                                                                    >
                                                                        {SWParticipantOptions.map((value) => (
                                                                            <option value={value}>{value}</option>
                                                                        ))}
                                                                    </Form.Select>
                                                                </div>
                                                                <div className="col">
                                                                    <MyFormGroupInput
                                                                        label="Number of rounds, blank will be calculated automatically"
                                                                        name="number_of_rounds"
                                                                        defaultValue={null}
                                                                        errors={errors}
                                                                        register={register}
                                                                        onChange={inputChangeHandler}
                                                                    ></MyFormGroupInput>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="row">
                                                            <div className="col">
                                                                <MyFormGroupInput
                                                                    label="Points for victory"
                                                                    name="points_victory"
                                                                    errors={errors}
                                                                    defaultValue={1}
                                                                    register={register}
                                                                    validationSchema={{
                                                                        required: "⚠ This input is required.",
                                                                    }}
                                                                    onChange={inputChangeHandler}
                                                                ></MyFormGroupInput>
                                                            </div>
                                                            <div className="col">
                                                                <MyFormGroupInput
                                                                    label="Points for draw"
                                                                    name="points_draw"
                                                                    errors={errors}
                                                                    defaultValue={0}
                                                                    register={register}
                                                                    validationSchema={{
                                                                        required: "⚠ This input is required.",
                                                                    }}
                                                                    onChange={inputChangeHandler}
                                                                ></MyFormGroupInput>
                                                            </div>
                                                            <div className="col">
                                                                <MyFormGroupInput
                                                                    label="Points for loss"
                                                                    name="points_loss"
                                                                    defaultValue={0}
                                                                    errors={errors}
                                                                    register={register}
                                                                    validationSchema={{
                                                                        required: "⚠ This input is required.",
                                                                    }}
                                                                    onChange={inputChangeHandler}
                                                                ></MyFormGroupInput>
                                                            </div>
                                                        </div>
                                                    </Fragment>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <MyFormGroupInput
                                    label="Participants"
                                    name="participants"
                                    defaultValue={participants}
                                    as="textarea"
                                    errors={errors}
                                    register={register}
                                    validationSchema={{
                                        validate: {
                                            checkAvailability: () => {
                                                return countNonEmptyRows();
                                            },
                                        },
                                    }}
                                    onChange={(e) => {
                                        participantsHandler(e);
                                    }}
                                ></MyFormGroupInput>
                            </Card.Body>
                        </MyCard>
                        {error != "" && <div className={`${classes.error_container}`}>{`⚠ ${error}`}</div>}
                    </div>
                    <div className="pb-4">
                        <MyButton additionalCl={"btn-md"} type="submit">
                            Create Tournament
                        </MyButton>
                    </div>
                </Form>
            </div>
        </section>
    );
};

export default CreateTournament;
