import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetching } from "../hooks/useFetching";
import "../styles/App.css";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import PostService from "../API/PostService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context";
import useAxios from "../utils/useAxios";
import UploadButton from "../components/UI/UploadButton/UploadButton";
import MyFormGroupInput from "../components/UI/MyFormGroupInput/MyFormGroupInput";
import { useForm } from "react-hook-form";
import MyButton from "../components/UI/MyButton/MyButton";
import MyCard from "../components/UI/MyCard/MyCard";

const EditTournament = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useContext(AuthContext);
  const [fetchTournament, isLoading, error] = useFetching(async (slug) => {
    const response = await PostService.getTournamentBySlug(slug);
    setResponseBody({
      title: response.data.title,
      content: response.data.content,
      // participants: response.data.participants,
      game: response.data.game,
      prize: response.data.prize,
      start_time: response.data.start_time,
      // type: response.data.type,
      creater_email: user.email,
    });
    reset(response.data);
  });

  const [responseBody, setResponseBody] = useState({
    title: "",
    content: "",
    start_time: "",
    // participants: "",
    game: "",
    prize: "",
    // type: "",
    creater_email: user.email,
  });
  const [inputFile, setInputFile] = useState(null);

  useEffect(() => {
    fetchTournament(params.slug);
  }, []);

  const inputChangeHandler = (inputValue) => {
    const { name, value } = inputValue;
    setResponseBody({ ...responseBody, [name]: value });
  };

  const onSubmitHandler = () => {
    const response = api.patch(
      `/edit_tournament/${params.slug}/`,
      { ...responseBody, poster: inputFile },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ).then(function (response) {
      if (response.status == 200) {
        navigate(`/tournament/${response.data.slug}`)
      }
    });
    
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });

  return (
    <section className="section_without_div pt-4">
      <Form onSubmit={handleSubmit(onSubmitHandler)}>
        <MyCard>
          <Card.Header className="tournament_text">Basic Info</Card.Header>
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
          </Card.Body>
        </MyCard>
        {/* <div className="my-4">
          <MyCard>
            <Card.Header className="tournament_text">Bracket Info</Card.Header>
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
                  className="shadow-none my_input"
                  name="type"
                  onChange={(e) => inputChangeHandler(e)}
                >
                  <option value="SE">Single Elimination</option>
                  <option value="DE">Double Elimination</option>
                  <option value="RR">Round Robin</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </MyCard>
        </div> */}
        <div className="form_button_div pb-4 pt-4">
          <MyButton additionalCl={"btn-md"} type="submit">
            Edit Tournament
          </MyButton>
        </div>
      </Form>
    </section>
  );
};

export default EditTournament;
