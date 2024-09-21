import React, { useEffect, useState, useContext, Fragment } from "react";
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

import classes from "./Tournament.module.css";
import DefaultTournamnetPoster from "../../assets/svg/DefaultTournamnetPoster";

import SingleElimination from "../../components/Brackets/SE/SingleElimination.jsx";
import RoundRobin from "../../components/Brackets/RR/RoundRobin.jsx";
import Swiss from "../../components/Brackets/SW/Swiss.jsx";
import DoubleElimination from "../../components/Brackets/DE/DoubleElimination.jsx";

import { setTournament } from "../../store/tournament";
import { setBracket } from "../../store/bracket";
import { useSelector, useDispatch } from "react-redux";

import bracketApi from "../../services/api/bracketApi";

const Tournament = () => {
  const dispatch = useDispatch()
  const params = useParams();
  const api = useAxios();
  const navigate = useNavigate();

  const [id, setId] = useState(0);
  const [types, setTypes] = useState("");
  const [groupStage, setGroupStage] = useState([]);

  const tournament = useSelector(state => state.tournament)
  const bracket = useSelector(state => state.bracket)

  const { user } = useContext(AuthContext);

  const [fetchTournament, isLoading, error] = useFetching(async (link) => {
    const response = await PostService.getTournamentBySlug(link);
    dispatch(setTournament(response.data));
  });

  const [fetchBrackets, isBraLoadind, braError] = useFetching(async () => {
    const response = await bracketApi.getBrackets(tournament.id)
    dispatch(setBracket({brackets: response.data}))
  });

  const onDelete = async () => {
    const response = await api.delete(`/delete_tournament/${params.link}/`).then(function (response) {
      if (response.status == 204) {
        navigate(`/tournaments`)
      }
    });;
  };

  const onEdit = async () => {
    navigate(`/edit_tournament/${params.link}/`);
  };

  useEffect(() => {
    fetchTournament(params.link);
  }, []);

  useEffect(() => {
    if (tournament.id) {
      fetchBrackets();
    }
  }, [tournament.id])

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
                      <Accordion.Item eventKey="1">
                        <Accordion.Header className="my_accordion_body">
                          <h4>Bracket</h4>
                        </Accordion.Header>
                        <Accordion.Body className="my_accordion_body">
                          {isBraLoadind ? 
                            <div className="loader">
                              <Loader />
                            </div>
                          : 
                            <Fragment>
                              {bracket.brackets.map((br) => {
                                if (br.type === 1) {
                                    return <SingleElimination
                                      bracket={br.rounds}
                                      bracketId={br.id}
                                    />
                                } else if (br.type === 2) {
                                    return <DoubleElimination
                                      bracket={br.rounds}
                                      bracketId={br.id}
                                    />
                                } else if (br.type == 3) {
                                    return <RoundRobin
                                      bracket={br.rounds}
                                      bracketId={br.id}
                                    />
                                } else if (br.type == 4) {
                                    return <Swiss
                                      bracket={br.rounds}
                                      bracketId={br.id}
                                    />
                                }
                              })
                              }
                            </Fragment>
                          }
                        </Accordion.Body>
                      </Accordion.Item>
                  </Accordion>
                </div>
              </div>

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
