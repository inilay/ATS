import React, { useState, useContext, Fragment } from "react";
import "../../../styles/App.css";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import UploadButton from "../../../components/UI/UploadButton/UploadButton";
import { useForm } from "react-hook-form";
import MyFormGroupInput from "../../../components/UI/MyFormGroupInput/MyFormGroupInput";
import MyButton from "../../../components/UI/MyButton/MyButton";
import MyCard from "../../../components/UI/MyCard/MyCard";
import classes from "./TournamentInfoInput.module.css";


const TournamentInfoInput = ({errors, register, inputChangeHandler, setInputFile, inputRadioChangeHandler, tournamentType}) => {


  return (
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
  );
};

export default TournamentInfoInput;