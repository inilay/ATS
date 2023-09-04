import React, { useState, useContext } from "react";
import "../styles/App.css";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context";
import useAxios from "../utils/useAxios";
import UploadButton from "../components/UI/UploadButton/UploadButton";
import { useForm } from "react-hook-form";
import MyFormGroupInput from "../components/UI/MyFormGroupInput/MyFormGroupInput";
import MyButton from "../components/UI/MyButton/MyButton";
import MyCard from "../components/UI/MyCard/MyCard";

const CreateTournament = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [responseBody, setResponseBody] = useState({
   
    type: "SE",
    points_loss: "0",
    points_draw: "0",
    points_victory: "1",

    secod_final: false,

    time_managment: false,
    avg_game_time: 30,
    max_games_number: 3,
    break_between: 10,
    mathes_same_time: 16,

    group_type: "RR",
    compete_in_group: 4,
    advance_from_group: 2,
    groups_per_day: 1,
    final_stage_time: false,
    creater_email: user.email,
  });
  const [inputFile, setInputFile] = useState(null);
  const [tournamentType, setTournamentType] = useState("0");
  const [timeManagment, setTimeManagment] = useState(false);

  const inputChangeHandler = (inputValue) => {
    const { name, value } = inputValue;
    setResponseBody({ ...responseBody, [name]: value });
  };

  const inputSelectChangeHandler = (event) => {
    const { name, value } = event.target;
    setResponseBody({ ...responseBody, [name]: value });
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

  const inputCheckBoxTimeManagmentChangeHandler = (e) => {
    const { target } = e;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;
    setTimeManagment(!timeManagment);
    setResponseBody({ ...responseBody, [name]: !timeManagment });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const onSubmitHandler = () => {
    setResponseBody({ ...responseBody, poster: inputFile });
    console.log({ ...responseBody, poster: inputFile });
    const response = api.post(
      `/create_tournament/`,
      { ...responseBody, poster: inputFile },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    ).then(function (response) {
      if (response.status == 201) {
        navigate(`/tournament/${responseBody.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}`)
      }
    });
    
  };

  return (
    <section className="section_without_div pt-4">
      <Form onSubmit={handleSubmit(onSubmitHandler)}>
        <MyCard>
          <Card.Header className="card-header-text">Basic Info</Card.Header>
          <Card.Body>
            <MyFormGroupInput
              label="Title"
              name="title"
              type="text"
              errors={errors}
              register={register}
              validationSchema={{
                required: "⚠ This input is required.",
              }}
              onChange={inputChangeHandler}
            ></MyFormGroupInput>
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
            ></MyFormGroupInput>
            <MyFormGroupInput
              label="Prize fund"
              name="prize"
              errors={errors}
              register={register}
              validationSchema={{
                required: "⚠ This input is required.",
                pattern: {
                  value: /^[+-]?\d+(\.\d+)?$/,
                  message: "⚠ Invalid data.",
                },
              }}
              onChange={inputChangeHandler}
            ></MyFormGroupInput>
            <MyFormGroupInput
              label="Game"
              name="game"
              errors={errors}
              register={register}
              validationSchema={{
                required: "⚠ This input is required.",
              }}
              onChange={inputChangeHandler}
            ></MyFormGroupInput>
            <MyFormGroupInput
              label="Start of the tournament"
              name="start_time"
              type="datetime-local"
              errors={errors}
              register={register}
              validationSchema={{
                required: "⚠ This input is required.",
              }}
              onChange={inputChangeHandler}
            ></MyFormGroupInput>
            <Form.Group className="mb-3">
              <Form.Label>Poster</Form.Label>
              <UploadButton setInputFileValue={setInputFile} />
            </Form.Group>
            <p>Tournament type</p>
            <div className="mb-3">
              <Form.Check
                inline
                label="One stage"
                name="tournament_type"
                type="radio"
                value="0"
                checked={tournamentType === "0" ? true : false}
                onChange={(event) => {
                  inputRadioChangeHandler(event);
                }}
              ></Form.Check>
              <Form.Check
                inline
                label="Group two stage"
                name="tournament_type"
                type="radio"
                value="1"
                checked={tournamentType === "1" ? true : false}
                onChange={(event) => {
                  inputRadioChangeHandler(event);
                }}
              ></Form.Check>
            </div>
          </Card.Body>
        </MyCard>

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
                        <option value="RR">Round Robin</option>
                        <option value="SE">Single Elimination</option>
                        <option value="DE">Double Elimination</option>
                        <option value="SW">Swiss</option>
                      </Form.Select>
                    </Form.Group>
                    <div className="row">
                      <div className="col">
                        <MyFormGroupInput
                          label="Compete in each group"
                          name="compete_in_group"
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

              <Form.Check type="checkbox">
                <Form.Check.Input
                  name="time_managment"
                  onChange={(e) => inputCheckBoxTimeManagmentChangeHandler(e)}
                  className="my_ckeckbox"
                  type="checkbox"
                />
                <Form.Check.Label
                  style={{ color: "inherit" }}
                >{`Add time managment`}</Form.Check.Label>
              </Form.Check>

              {timeManagment === true ? (
                <>
                  <div className="col">
                    <MyFormGroupInput
                      label="Mathes at the same time"
                      name="mathes_same_time"
                      errors={errors}
                      defaultValue={16}
                      register={register}
                      validationSchema={{
                        required: "⚠ This input is required.",
                      }}
                      onChange={inputChangeHandler}
                    ></MyFormGroupInput>
                  </div>
                  <div className="col">
                    <MyFormGroupInput
                      label="Average game time in minutes"
                      name="avg_game_time"
                      errors={errors}
                      defaultValue={30}
                      register={register}
                      validationSchema={{
                        required: "⚠ This input is required.",
                      }}
                      onChange={inputChangeHandler}
                    ></MyFormGroupInput>
                  </div>
                  <div className="col">
                    <MyFormGroupInput
                      label="Maximum number of games per match (best of ...)"
                      name="max_games_number"
                      errors={errors}
                      defaultValue={3}
                      register={register}
                      validationSchema={{
                        required: "⚠ This input is required.",
                      }}
                      onChange={inputChangeHandler}
                    ></MyFormGroupInput>
                  </div>
                  <div className="col">
                    <MyFormGroupInput
                      label="Break between matches in minutes"
                      name="break_between"
                      errors={errors}
                      defaultValue={10}
                      register={register}
                      validationSchema={{
                        required: "⚠ This input is required.",
                      }}
                      onChange={inputChangeHandler}
                    ></MyFormGroupInput>
                  </div>
                  {tournamentType === "1" ? (
                    <>
                      <div className="col">
                        <MyFormGroupInput
                          label="Groups per day"
                          name="groups_per_day"
                          errors={errors}
                          defaultValue={1}
                          register={register}
                          validationSchema={{
                            required: "⚠ This input is required.",
                          }}
                          onChange={inputChangeHandler}
                        ></MyFormGroupInput>
                      </div>
                      <Form.Check type="checkbox">
                        <Form.Check.Input
                          name="final_stage_time"
                          onChange={(e) => inputCheckBoxChangeHandler(e)}
                          className="my_ckeckbox"
                          type="checkbox"
                        />
                        <Form.Check.Label
                          style={{ color: "inherit" }}
                        >{`Final on a separate day`}</Form.Check.Label>
                      </Form.Check>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </Card.Body>
          </MyCard>
        </div>
        <div className="form_button_div pb-4">
          <MyButton additionalCl={"btn-md"} type="submit">
            Create
          </MyButton>
        </div>
      </Form>
    </section>
  );
};

export default CreateTournament;