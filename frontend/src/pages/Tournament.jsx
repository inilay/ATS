import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useFetching } from "../hooks/useFetching";
import Loader from "../components/UI/Loader/Loader";
import PostService from "../API/PostService";
import useAxios from "../API/useAxios";
import { AuthContext } from "../context";
import { useNavigate } from "react-router-dom";
import MyButton from "../components/UI/MyButton/MyButton";
import Accordion from "react-bootstrap/Accordion";
import moment from "moment";
import RoundRobin from "../components/RoundRobin";
import Swiss from "../components/Swiss";
import SingleEl from "../components/SingleEl";
import DoubleEl from "../components/DoubleEl";

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

  useEffect(() => {}, [bracket]);

  return (
    <section>
      {isLoading ? (
        <div className="loader">
          <Loader />
        </div>
      ) : (
        <div className="container">
          <div className="row p-3">
            <div className="col-lg-12 col-md-12">
              <div className="row">
                <div className="col-sm-8">
                  {tournament.poster == null ? (
                    <div className="tournament_img">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="512px"
                        height="512px"
                        version="1"
                        className="my_svg"
                        viewBox="30 20 300 300"
                      >
                        <path
                          d="M680 2568c-63-5-211-7-327-3l-213 5v-58l99-7 99-7 12-112c10-96 10-127-5-221-9-61-21-139-25-175-5-36-14-94-20-130-7-38-12-207-13-405-2-330-1-342 21-402 22-62 22-66 12-310-5-137-12-284-15-327l-6-79 193 7c106 3 369 1 583-4 361-10 792-5 1443 17l132 4-6 87c-4 56-13 105-27 137-19 44-22 66-20 180 2 158 21 543 33 680 9 100-4 727-16 813-6 43-8 44-38 39-293-48-577-50-879-7-37 6-239 13-450 17-342 5-386 4-421-11-23-9-82-19-140-23l-101-6 3-296c2-163 3-326 2-364 0-37 7-97 16-133 10-40 14-81 10-103-33-191-35-227-27-514 6-182 13-292 20-301 14-17 766-22 821-5 33 10 221 20 695 38 110 4 208 11 218 15 13 7 17 21 17 70 0 33 7 97 16 141 16 74 16 112 0 540-17 484-30 677-46 721l-10 26-128-6c-412-19-668-23-972-15-184 4-353 8-376 9h-41l-17-147c-9-82-21-179-27-218-19-128 17-930 42-946 40-24 684-17 723 9 6 4 126 10 266 14s278 10 306 14l51 6 23 104c19 85 27 106 47 120l25 16-5 176c-3 98-12 220-21 272s-20 157-26 234c-8 114-12 141-27 152-14 10-64 13-208 14-188 0-734-16-892-26l-83-6v-71c0-40-8-126-17-192-18-127-23-520-8-621l8-52 45-6c80-11 514-6 602 6 47 7 149 11 228 10 175-4 176-3 167 84-5 41-3 64 4 68 6 4 11 31 11 60 0 34 5 58 14 65 10 8 16 49 21 137 8 139 5 150-52 217-26 30-33 46-33 81 0 23-5 57-11 75l-11 31h-272c-150 0-334-3-410-7l-137-6 1-66c1-36-2-137-6-225-3-87-3-201 1-252l7-94 39-10c24-7 146-10 322-8 260 3 285 5 315 23 36 22 40 46 17 110-10 28-14 85-15 184 0 79-5 161-11 182-11 35-16 39-63 50-69 15-193 7-294-19-46-12-112-22-148-22-61 0-64-1-64-24 0-13 11-58 25-100 16-50 25-99 25-141v-65h190c221 0 204-13 169 131-25 101-22 99-141 99h-78v-30c0-30 0-30 58-30 31 0 62-4 68-8 10-6 34-73 34-94 0-5-54-8-120-8h-120v58c0 33-6 80-14 105l-14 47h46c50 0 185 26 214 41 24 12 73 11 118-2 51-15 58-45 61-243 3-147 1-159-17-169-24-14-453-19-506-6l-36 9-7 95c-7 90-4 168 11 346l6 76 121 7c66 3 221 6 344 6h223l10-26c6-14 10-47 10-75 0-41 5-53 29-76 49-48 59-79 53-165-3-48-10-82-18-89-9-7-14-32-14-63 0-29-4-56-9-61-6-6-11-39-13-75l-3-64-155-2c-85 0-186-6-225-12-74-12-434-16-497-6l-37 6-5 62c-13 141-10 383 7 501 9 66 17 150 17 187v66l83 6c136 9 682 26 830 26 110 0 142-3 154-15 10-11 17-51 24-143 8-127 19-223 39-337 5-33 10-101 10-151 0-84-2-93-23-107-17-11-28-37-45-109l-23-95-52-13c-32-8-148-15-302-19-137-3-255-9-261-13-22-15-300-28-453-22l-159 7-6 26c-8 33-37 446-43 616-2 72 0 162 6 200 5 39 18 135 27 213l18 144 90-7c164-13 1009-9 1160 5 167 16 161 19 170-108 4-48 11-127 16-177 5-49 14-255 20-457 9-313 9-375-4-425-8-32-17-88-21-125s-12-71-18-75c-7-5-100-11-207-15-453-16-648-26-692-38-35-9-104-10-255-5-302 10-312 10-378 1-51-7-63-6-74 8-22 27-31 474-12 591 8 50 14 137 14 195-2 93-16 310-23 350-2 8-2 114-2 236l2 221 101 7c62 4 113 13 132 23 29 14 67 15 370 9 186-4 361-11 390-16 136-23 344-32 582-27 138 3 267 9 287 13 36 6 37 5 43-27 10-59 21-611 14-699-8-93-24-406-35-681-7-162-5-181 14-246 22-71 28-132 15-134-241-27-995-41-1483-28-228 6-479 8-557 5l-141-7-4 58c-2 32 0 174 5 316 9 253 9 259-13 325-15 45-24 101-27 172-6 124 12 545 26 610 40 182 62 532 38 596-7 21-4 21 210 30 120 5 622 9 1116 8l897-1v54l-257 6c-363 10-1556 6-1693-5z"
                          transform="matrix(.1 0 0 -.1 0 300)"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <img
                      src={tournament.poster}
                      className="pe-4 tournament-img"
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
                    <p>Organizer</p>
                    <p className="tournament_text">{tournament.owner}</p>
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
