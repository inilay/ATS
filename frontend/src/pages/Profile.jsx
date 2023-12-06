import React, { useEffect, useState } from "react";
import PostService from "../API/PostService";
import { useParams } from "react-router-dom";
import { useFetching } from "../hooks/useFetching";
import { useTournaments } from "../hooks/useTournaments";
import TournamentList from "../components/TournamentList";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Collapse from "react-bootstrap/Collapse";
import "../styles/App.css";
import useAxios from "../API/useAxios";
import UploadButton from "../components/UI/UploadButton/UploadButton";
import MyFormGroupInput from "../components/UI/MyFormGroupInput/MyFormGroupInput";
import { useForm } from "react-hook-form";
import MyButton from "../components/UI/MyButton/MyButton";
import moment from "moment";
import MyCard from "../components/UI/MyCard/MyCard";

const Profile = () => {
  const api = useAxios();
  const params = useParams();
  const [filter, setFilter] = useState({ sort: "", query: "" });
  const [profile, setProfile] = useState({ user: {}, tournaments: [] });
  const sortedAndSearchedTournaments = useTournaments(
    profile.tournaments,
    filter.sort,
    filter.query
  );
  const [openTournaments, setOpenTournaments] = useState(false);
  const [openPasswordChange, setOpenPasswordChange] = useState(false);
  const [openProfileChange, setOpenProfileChange] = useState(false);
  const [state, setState] = useState({
    old_password: "",
    new_password: "",
    re_new_password: "",
  });
  const [inputFile, setInputFile] = useState(null);

  const {
    register,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    const response = api.post("/password_change/", state);
  };

  const inputChangeHandler = (inputValue) => {
    const { name, value } = inputValue;
    setState({ ...state, [name]: value });
  };

  const handleImageChangeSubmit = (e) => {
    e.preventDefault();
    console.log(inputFile);
    const response = api.patch(
      `/img_change/${params.slug}/`,
      { slug: params.slug, user_icon: inputFile },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  const [fetchPostById, isLoadind, error] = useFetching(async (slug) => {
    const response = await PostService.getProfileBySlug(slug);
    setProfile(response.data);
  });

  useEffect(() => {
    fetchPostById(params.slug);
  }, []);
  console.log(profile.user_icon)
  return (
    <section className="container">
      <div className="row align-items-center">
        <div className="col-lg-12 col-md-12">
          <div className="profile-container my-5">
            <div style={{ textAlign: "center" }}>
              <img
                src={profile.user_icon}
                alt="user profile"
                className="profile-icon mb-3"
              />
              <h4>{profile.user.username}</h4>
              <p></p>
              <p>
                With us since{" "}
                {moment(profile.user.date_joined).format("MMMM Do YYYY") || ""}
              </p>
            </div>
          </div>
          <div className="mb-3">
            <div className="d-grid">
              <button
                onClick={() => setOpenTournaments(!openTournaments)}
                aria-controls="example-collapse-text"
                aria-expanded={openTournaments}
                style={{
                  margin: "auto",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  background: "inherit",
                  color: "inherit",
                  border: "0px",
                }}
              >
                Tournaments
              </button>
            </div>
            <Collapse in={openTournaments}>
              <div id="example-collapse-text">
                <TournamentList
                  tournaments={sortedAndSearchedTournaments}
                  title="Список"
                />
              </div>
            </Collapse>
          </div>
          <div className="mb-3">
            <div className="d-grid">
              <button
                onClick={() => setOpenProfileChange(!openProfileChange)}
                aria-controls="example-collapse-text"
                aria-expanded={openProfileChange}
                style={{
                  margin: "auto",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  background: "inherit",
                  color: "inherit",
                  border: "0px",
                }}
              >
                Profile settings
              </button>
            </div>
            <Collapse in={openProfileChange} className="mt-2">
              <div id="example-collapse-text">
                <Form onSubmit={handleImageChangeSubmit} className="my-4">
                  <MyCard border="success" style={{ width: "80%" }}>
                    <Card.Header className="card-header-text">
                      Avatar
                    </Card.Header>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <UploadButton setInputFileValue={setInputFile} />
                      </Form.Group>
                      <MyButton additionalCl={"btn-md"} type="submit">
                        Save
                      </MyButton>
                    </Card.Body>
                  </MyCard>
                </Form>
              </div>
            </Collapse>
          </div>
          <div className="mb-3">
            <div className="d-grid">
              <button
                onClick={() => setOpenPasswordChange(!openPasswordChange)}
                aria-controls="example-collapse-text"
                aria-expanded={openPasswordChange}
                style={{
                  margin: "auto",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  background: "inherit",
                  color: "inherit",
                  border: "0px",
                }}
              >
                Security Settings
              </button>
            </div>
            <Collapse in={openPasswordChange} className="mt-2">
              <div id="example-collapse-text">
                <Form onSubmit={handlePasswordChangeSubmit} className="my-4">
                  <MyCard style={{ width: "80%" }}>
                    <Card.Header className="card-header-text">
                      Change password
                    </Card.Header>
                    <Card.Body>
                      <MyFormGroupInput
                        label="Old password"
                        type="password"
                        name="old_password"
                        errors={errors}
                        register={register}
                        validationSchema={{
                          required: "⚠ This input is required.",
                        }}
                        onChange={inputChangeHandler}
                      ></MyFormGroupInput>
                      <MyFormGroupInput
                        label="New password"
                        type="password"
                        name="new_password"
                        errors={errors}
                        register={register}
                        validationSchema={{
                          required: "⚠ This input is required.",
                        }}
                        onChange={inputChangeHandler}
                      ></MyFormGroupInput>
                      <MyFormGroupInput
                        label="Repeat new password"
                        type="password"
                        name="re_new_password"
                        errors={errors}
                        register={register}
                        validationSchema={{
                          required: "⚠ This input is required.",
                          validate: (value) => {
                            const { new_password } = getValues();
                            return (
                              new_password === value ||
                              "⚠ Passwords should match!"
                            );
                          },
                        }}
                        onChange={inputChangeHandler}
                      ></MyFormGroupInput>
                      <MyButton additionalCl={"btn-md"} type="submit">
                        Save
                      </MyButton>
                    </Card.Body>
                  </MyCard>
                </Form>
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
