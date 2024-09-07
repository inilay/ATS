import React, { useState, useContext } from "react";
import "../../styles/App.css";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context";
import useAxios from "../../API/useAxios";
import UploadButton from "../../components/UI/UploadButton/UploadButton";
import { useForm } from "react-hook-form";
import MyFormGroupInput from "../../components/UI/MyFormGroupInput/MyFormGroupInput";
import MyButton from "../../components/UI/MyButton/MyButton";
import MyCard from "../../components/UI/MyCard/MyCard";
import classes from "./CreateTournament.module.css";


const CreateTournament = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [responseBody, setResponseBody] = useState({

    bracket_type: 1,
    points_loss: "0",
    points_draw: "0",
    points_victory: "1",

    secod_final: false,

    group_type: "RR",
    compete_in_group: 4,
    advance_from_group: 2,

    creater_email: user.email,
  });
  const [inputFile, setInputFile] = useState(null);
  const [tournamentType, setTournamentType] = useState("0");

  const inputChangeHandler = (inputValue) => {
    const { name, value } = inputValue;
    setResponseBody({ ...responseBody, [name]: value });
  };

  const inputSelectChangeHandler = (event) => {
    const { name, value } = event.target;
    setResponseBody({ ...responseBody, [name]: parseInt(value) });
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
        // navigate(`/tournament/${responseBody.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}`)
      }
    });

  };

  return (
    <section>
      <div className={`${classes.create_tournament_form}`}>
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
                 
                }}
                onChange={inputChangeHandler}
              ></MyFormGroupInput>
              <MyFormGroupInput
                label="Prize fund"
                name="prize"
                errors={errors}
                register={register}
                validationSchema={{
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
              {/* <p>Tournament type</p>
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
              </div> */}
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
                          <option value="1">Single Elimination</option>
                          <option value="2">Round Robin</option>
                          <option value="3">Double Elimination</option>
                          <option value="4">Swiss</option>
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
                    name="bracket_type"
                    onChange={(e) => inputSelectChangeHandler(e)}
                  >
                    <option value="1">Single Elimination</option>
                    <option value="2">Double Elimination</option>
                    <option value="4">Round Robin</option>
                    <option value="5">Swiss</option>
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
                  <div class="accordion" id="accordionExample">
                    <div class="accordion-item">
                      <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                          Accordion Item #1
                        </button>
                      </h2>
                      <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                          <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                      </div>
                    </div>
                  </div>

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
              </Card.Body>
            </MyCard>
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