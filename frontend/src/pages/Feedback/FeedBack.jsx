import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

import { useForm } from "react-hook-form";
import MyFormGroupInput from "../../components/UI/MyFormGroupInput/MyFormGroupInput";
import MyButton from "../../components/UI/MyButton/MyButton";
import MyCard from "../../components/UI/MyCard/MyCard";
import classes from "./FeedBack.module.css";
import auxiliaryApi from "../../services/api/auxiliaryApi";
import useAxios from "../../API/useAxios";

const FeedBack = () => {
    const navigate = useNavigate();

    const [responseBody, setResponseBody] = useState({
        participants: "",
        type: "SE",
        points_loss: "0",
        points_draw: "0",
        points_victory: "1",
        secod_final: false,
    });
    const api = useAxios();

    const inputChangeHandler = (inputValue) => {
        const { name, value } = inputValue;
        setResponseBody({ ...responseBody, [name]: value });
        setValue(name, value);
    };

    const inputSelectChangeHandler = (event) => {
        const { name, value } = event.target;
        setResponseBody({ ...responseBody, [name]: value });
    };

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onBlur" });

    const onSubmitHandler = () => {
        const response = auxiliaryApi.sendFeedback(api, responseBody).then(function (response) {
            if (response.status == 201) {
                navigate(`/`);
            }
        });
    };

    return (
        <section>
            <div className={`${classes.feedback_form}`}>
                <Form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="my-4">
                        <MyCard border="success">
                            <Card.Header className="card-header-text">Feedback</Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label className={`${classes.myFormLabel}`}>Type</Form.Label>
                                    <Form.Select
                                        className="shadow-none select-input"
                                        name="type"
                                        onChange={(e) => inputSelectChangeHandler(e)}
                                    >
                                        <option value="BUG">Bug</option>
                                        <option value="PROPOSAL">Proposal</option>
                                        <option value="OTHER">Other</option>
                                    </Form.Select>
                                </Form.Group>
                                <MyFormGroupInput
                                    label="Description"
                                    name="content"
                                    as="textarea"
                                    errors={errors}
                                    register={register}
                                    validationSchema={{
                                        required: "⚠ This input is required.",
                                    }}
                                    onChange={inputChangeHandler}
                                />
                            </Card.Body>
                        </MyCard>
                    </div>
                    <div className="mt-3">
                        <MyButton additionalCl={"btn-md"} type="submit">
                            Send Feedback
                        </MyButton>
                    </div>
                </Form>
            </div>
        </section>
    );
};

export default FeedBack;
