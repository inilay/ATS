import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import "../styles/App.css";
import PostService from "../API/PostService";
import { useForm } from "react-hook-form";
import MyFormGroupInput from "../components/UI/MyFormGroupInput/MyFormGroupInput";
import MyButton from "../components/UI/MyButton/MyButton";
import MyCard from "../components/UI/MyCard/MyCard";

const CreateBracket = () => {
  const navigate = useNavigate();

  const [responseBody, setResponseBody] = useState({
    participants: "",
    type: "SE",
    points_loss: "0",
    points_draw: "0",
    points_victory: "1",
    secod_final: false,
  });

  const inputChangeHandler = (inputValue) => {
    const { name, value } = inputValue;
    setResponseBody({ ...responseBody, [name]: value });
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
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const onSubmitHandler = () => {
    const response = PostService.createBracket(responseBody).then(function (response) {
      if (response.status == 201) {
        navigate(`/bracket/${response.data.id}`);
      }
    });
  };

  return (
    <section className="section_without_div pt-4">
      <Form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="my-4">
          <MyCard border="success">
            <Card.Header className="card-header-text">Bracket info</Card.Header>
            <Card.Body>
              <MyFormGroupInput
                label="Participants"
                name="participants"
                as="textarea"
                errors={errors}
                register={register}
                validationSchema={{
                  required: "⚠ This input is required.",
                  pattern: {
                    value: /^.+\s+./i,
                    message: "⚠ Minimum two participants.",
                  },
                }}
                onChange={inputChangeHandler}
              ></MyFormGroupInput>
              <Form.Group className="mb-3">
                <Form.Label>Bracket type</Form.Label>
                <Form.Select
                  className="shadow-none select-input"
                  name="type"
                  onChange={(e) => inputSelectChangeHandler(e)}
                >
                  <option value="SE">Single Elimination</option>
                  <option value="DE">Double Elimination</option>
                  <option value="RR">Round Robin</option>
                  <option value="SW">Swiss</option>
                </Form.Select>
              </Form.Group>
              {responseBody.type === "SE" ? (
                <Form.Check type="checkbox">
                  <Form.Check.Input
                    name="secod_final"
                    onChange={(e) => inputCheckBoxChangeHandler(e)}
                    className="my_ckeckbox"
                    type="checkbox"
                  />
                  <Form.Check.Label
                    style={{ color: "inherit" }}
                  >{`Include a match for 3rd place between semifinal losers`}</Form.Check.Label>
                </Form.Check>
              ) : (
                <></>
              )}
              {responseBody.type === "RR" || responseBody.type === "SW" ? (
                <>
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
                        label="Points per loss"
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
                </>
              ) : (
                <></>
              )}
            </Card.Body>
          </MyCard>
        </div>
        <div className="form_button_div pb-4">
          <MyButton additionalCl={"btn-md"} type="submit">
            Create Bracket
          </MyButton>
        </div>
      </Form>
    </section>
  );
};

export default CreateBracket;
