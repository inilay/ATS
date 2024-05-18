import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useFetching } from "../../hooks/useFetching";
import Loader from "../../components/UI/Loader/Loader";
import PostService from "../../API/PostService";
import useAxios from "../../API/useAxios";
import { AuthContext } from "../../context";
import { useNavigate } from "react-router-dom";
import MyButton from "../../components/UI/MyButton/MyButton";
import Accordion from "react-bootstrap/Accordion";
import moment from "moment";
import RoundRobin from "../../components/RoundRobin";
import Swiss from "../../components/Swiss";
import SingleEl from "../../components/SingleEl";
import DoubleEl from "../../components/DoubleEl";
import classes from "./Tournament.module.css";
import DefaultTournamnetPoster from "../../assets/svg/DefaultTournamnetPoster";

const Tournament = () => {
  const params = useParams();
  const [id, setId] = useState(0);
  const [bracket, setBracket] = useState([]);
  const [types, setTypes] = useState("");
  const [groupStage, setGroupStage] = useState([]);
  const [tournament, setTournament] = useState({});

  const { user } = useContext(AuthContext);
  const [fetchTournament, isLoading, error] = useFetching(async (slug) => {
    const response = await PostService.getTournamentBySlug(slug);
    setTournament(response.data);
  });

  const api = useAxios();
  const navigate = useNavigate();
  const onDelete = async () => {
    const response = await api.delete(`/delete_tournament/${params.slug}/`).then(function (response) {
      if (response.status == 204) {
        navigate(`/tournaments`)
      }
    });;
  };

  const onEdit = async () => {
    navigate(`/edit_tournament/${params.slug}/`);
  };

  const [fetchBrackets, isBraLoadind, braError] = useFetching(async (slug) => {
    const response = await PostService.allTournamentBrackets(slug);

    if (response.data.length > 1) {
      for (let i = 0; i < response.data.length - 1; i++) {
        setGroupStage((groupStage) => [
          ...groupStage,
          [
            response.data[i].id,
            response.data[i].type,
            response.data[i].bracket,
          ],
        ]);
      }
    }
    setBracket(

      response.data[response.data.length - 1].bracket
    );
    setTypes(response.data[response.data.length - 1].type);
    setId(response.data[response.data.length - 1].id);
  });

  useEffect(() => {
    fetchTournament(params.slug);
    fetchBrackets(params.slug);
  }, []);

  useEffect(() => { }, [bracket]);

  return (
    <section>
      {isLoading ? (
        <div className="loader">
          <Loader />
        </div>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="row">
                <div className="col-sm-8">
                  {tournament.poster == null ? (
                    <div className={`${classes.tournament_default}`}>
                      <DefaultTournamnetPoster />
                    </div>
                  ) : (
                    <img
                      src={tournament.poster}
                      className={`${classes.tournament_img}`}
                      alt="card text"
                    />
                  )}
                </div>
                <div className="col-sm-4">
                  <div className="d-flex flex-column pt-1">
                    <h3 className="tournament_text">{tournament.title}</h3>
                    <p>Start of the tournament</p>
                    <p className="tournament_text">
                      {moment(tournament.start_time).format(
                        " Do MMMM  YYYY, hh:mm"
                      ) || ""}
                    </p>
                    <p>Game</p>
                    <p className="tournament_text">{tournament.game}</p>
                    <p>Prize fund</p>
                    <p className="tournament_text">
                      {tournament.prize} <span>&#8381;</span>
                    </p>
                    <div className={`${classes.tournament_block}`}>
                      <p>Organizer</p>
                      <p className="tournament_text ">{tournament.owner}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row my-3">
                <div className="col">
                  <Accordion flush defaultActiveKey={["1", "2"]} alwaysOpen>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header className="my_accordion_body">
                        <h4>Description</h4>
                      </Accordion.Header>
                      <Accordion.Body className="my_accordion_body">
                        <p>{tournament.content}</p>
                      </Accordion.Body>
                    </Accordion.Item>
                    {groupStage.length > 0 ? (
                      <>
                        <Accordion.Item eventKey="1">
                          <Accordion.Header className="my_accordion_body">
                            <h4>Group stage</h4>
                          </Accordion.Header>
                          <Accordion.Body className="my_accordion_body">
                            {isBraLoadind ? (
                              <div className="loader">
                                <Loader />
                              </div>
                            ) : (
                              <>
                                {groupStage.map((bracket, idx) => {
                                  if (bracket[1] === "RR") {
                                    return (
                                      <div className="mb-5">
                                        <h5>Group {idx}</h5>
                                        <RoundRobin
                                          id={bracket[0]}
                                          bracket={bracket[2]}
                                          owner={tournament.owner}
                                        />
                                      </div>
                                    );
                                  } else if (bracket[1] === "SE") {
                                    return (
                                      <div className="mb-5">
                                        <h5>Group {idx}</h5>
                                        <SingleEl
                                          id={bracket[0]}
                                          bracket={bracket[2]}
                                          owner={tournament.owner}
                                        />
                                      </div>
                                    );
                                  } else if (bracket[1] === "DE") {
                                    return (
                                      <div className="mb-5">
                                        <h5>Group {idx}</h5>
                                        <DoubleEl
                                          id={bracket[0]}
                                          bracket={bracket[2]}
                                          owner={tournament.owner}
                                        />
                                      </div>
                                    );
                                  } else if (bracket[1] === "SW") {
                                    return (
                                      <div className="mb-5">
                                        <h5>Group {idx}</h5>
                                        <Swiss
                                          id={bracket[0]}
                                          bracket={bracket[2]}
                                          owner={tournament.owner}
                                        />
                                      </div>
                                    );
                                  }
                                })}
                              </>
                            )}
                          </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                          <Accordion.Header className="my_accordion_body">
                            <h4>Final stage</h4>
                          </Accordion.Header>
                          <Accordion.Body className="my_accordion_body">
                            {isBraLoadind ? (
                              <div className="loader">
                                <Loader />
                              </div>
                            ) : (
                              <>
                                {(() => {
                                  if (types == "SE") {
                                    return (
                                      <SingleEl
                                        id={id}
                                        bracket={bracket}
                                        owner={tournament.owner}
                                      />
                                    );
                                  } else if (types == "RR") {
                                    return (
                                      <RoundRobin
                                        id={id}
                                        bracket={bracket}
                                        owner={tournament.owner}
                                      />
                                    );
                                  } else if (types == "DE") {
                                    return (
                                      <DoubleEl
                                        id={id}
                                        bracket={bracket}
                                        owner={tournament.owner}
                                      />
                                    );
                                  } else if (types == "SW") {
                                    return (
                                      <Swiss
                                        id={id}
                                        bracket={bracket}
                                        owner={tournament.owner}
                                      />
                                    );
                                  }
                                })()}
                              </>
                            )}
                          </Accordion.Body>
                        </Accordion.Item>
                      </>
                    ) : (
                      <Accordion.Item eventKey="1">
                        <Accordion.Header className="my_accordion_body">
                          <h4>Bracket</h4>
                        </Accordion.Header>
                        <Accordion.Body className="my_accordion_body">
                          {isBraLoadind ? (
                            <div className="loader">
                              <Loader />
                            </div>
                          ) : (
                            <>
                              {" "}
                              {(() => {
                                if (types == "SE") {
                                  return (
                                    <SingleEl
                                      id={id}
                                      bracket={bracket}
                                      owner={tournament.owner}
                                    />
                                  );
                                } else if (types == "RR") {
                                  return (
                                    <RoundRobin
                                      id={id}
                                      bracket={bracket}
                                      owner={tournament.owner}
                                    />
                                  );
                                } else if (types == "DE") {
                                  return (
                                    <DoubleEl
                                      id={id}
                                      bracket={bracket}
                                      owner={tournament.owner}
                                    />
                                  );
                                } else if (types == "SW") {
                                  return (
                                    <Swiss
                                      id={id}
                                      bracket={bracket}
                                      owner={tournament.owner}
                                    />
                                  );
                                }
                              })()}
                            </>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    )}
                  </Accordion>
                </div>
              </div>
              {/* {user !== null && tournament.owner == user.username ? ( */}
              <>
                <MyButton
                  additionalCl={"btn-md btn my-3 me-3"}
                  type="submit"
                  onClick={onEdit}
                >
                  Edit Tournament
                </MyButton>
                <MyButton
                  additionalCl={"btn-md btn my-3 me-3"}
                  type="submit"
                  onClick={onDelete}
                >
                  Delete
                </MyButton>
              </>
              {/* // ) : (
              //   <></>
              // )} */}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Tournament;
