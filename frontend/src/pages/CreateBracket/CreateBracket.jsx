import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

import { useForm } from "react-hook-form";
import MyFormGroupInput from "../../components/UI/MyFormGroupInput/MyFormGroupInput";
import MyButton from "../../components/UI/MyButton/MyButton";
import MyCard from "../../components/UI/MyCard/MyCard";
import classes from "./CreateBracket.module.css";
import bracketApi from "../../services/api/bracketApi";
import axios from "axios";

const CreateBracket = () => {
    const navigate = useNavigate();
    const api = axios;
    const [shuffleParticipants, setShuffleParticipants] = useState(false);
    const [participants, setParticipants] = useState("");
    const [responseBody, setResponseBody] = useState({
        bracket_type: 1,
        advances_to_next: 1,
        participant_in_match: 2,

        points_loss: 0,
        points_draw: 0,
        points_victory: 1,
    });

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

    const participantsHandler = (e) => {
        setParticipants(e.value);
        setValue("participants", e.value);
    };

    const countNonEmptyRows = () => {
        const text = participants;
        const lines = text.split("\n");
        const nonEmptyLines = lines.filter((line) => line.trim() !== "");
        const count = nonEmptyLines.length;
        
        
        let maxNumber = (responseBody?.bracket_type == 3 ? 20 : responseBody?.bracket_type == 4 ? 64 : 256) || 256;
        let minNumber = responseBody?.participant_in_match * 2 || 2;

        if (count < minNumber) {
            return `⚠ Minimum number of participants ${minNumber}.`;
        } else if (count > maxNumber) {
            return `⚠ Maximum number of participants ${maxNumber}.`;
        }
    };

    const countNumberOfRounds = () => {
        let maxNumber = 12
        let minNumber = 1

        if (responseBody?.number_of_rounds < minNumber) {
            return `⚠ Minimum number of participants ${minNumber}.`;
        } else if (responseBody?.number_of_rounds > maxNumber) {
            return `⚠ Maximum number of rounds ${maxNumber}.`;
        }
    }

    const inputChangeHandler = (inputValue) => {
        const { name, value } = inputValue;
        setResponseBody({ ...responseBody, [name]: value });
        setValue(name, value);
    };


    const inputSelectChangeHandler = (event) => {
        const { name, value } = event.target;
        setResponseBody({ ...responseBody, [name]: value });
    };

    const inputCheckBoxChangeHandler = (e) => {
        const { target } = e;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const { name } = target;
        setResponseBody({ ...responseBody, [name]: value });
    };

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onBlur" });

    const onSubmitHandler = () => {
        console.log("send");
        let data = { ...responseBody, participants: participants, shuffle: shuffleParticipants };
        const response = bracketApi.createBracket(api, data).then(function (response) {
            if (response.status == 201) {
                navigate(`/bracket/${response.data.link}`);
            }
        });
    };

    return (
        <section>
            <div className={`${classes.create_bracket_form}`}>
                <Form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="my-4">
                        <MyCard>
                            <Card.Header className="card-header-text">Bracket Info</Card.Header>
                            <Card.Body>
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
                                                <div className={`${classes.additional_settings_wrapper} gx-5`}>
                                                    <div className={classes.se_additional_settings}>
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
                                                    <div className={classes.se_additional_settings}>
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
                                                            </Fragment>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                // For SW and RR brackets
                                                <Fragment>
                                                    {/* Only for SW */}
                                                    {responseBody.bracket_type == 4 && (
                                                        <div className={classes.additional_settings_wrapper}>
                                                            <div className={classes.se_additional_settings}>
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
                                                            <div className={classes.se_additional_settings}>
                                                                <MyFormGroupInput
                                                                    label="Number of rounds"
                                                                    name="number_of_rounds"
                                                                    defaultValue={null}
                                                                    errors={errors}
                                                                    validationSchema={{
                                                                        validate: {
                                                                            checkAvailability: () => {
                                                                                return countNumberOfRounds();
                                                                            },
                                                                        },
                                                                    }}
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
                                <div className="mb-3">
                                    <Form.Check
                                        inline
                                        label="Save participants order"
                                        type="radio"
                                        value="0"
                                        checked={shuffleParticipants === false}
                                        onChange={() => {
                                            setShuffleParticipants(false);
                                        }}
                                    ></Form.Check>
                                    <Form.Check
                                        inline
                                        label="Shuffle after creation"
                                        type="radio"
                                        value="1"
                                        checked={shuffleParticipants === true}
                                        onChange={() => {
                                            setShuffleParticipants(true);
                                        }}
                                    ></Form.Check>
                                </div>
                            </Card.Body>
                        </MyCard>
                    </div>
                    <div className="mt-3">
                        <MyButton additionalCl={"btn-md"} type="submit">
                            Create Bracket
                        </MyButton>
                    </div>
                </Form>
            </div>
        </section>
    );
};

export default CreateBracket;
