import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MyDataList from "../UI/MyDataList/MyDataList";
import MyButton from "../UI/MyButton/MyButton";
import PostService from "../../API/PostService";
import classes from './TournamentFilter.module.css'

const TournamentFilter = ({ filter, setFilter }) => {
  const [gamesFilter, setGamesFilter] = useState([]);

  useEffect(() => {
    const response = PostService.getAllGames().then(function (response) {
      if (response.status == 200) {
        setGamesFilter(response.data);
        console.log(response.data)
      }
    });

  }, []);

  return (
    <div className="row ">
      <div className="col-lg-12 col-md-12">
        <Row>
          <Col>
            <input
              value={filter.title}
              onChange={(e) => setFilter({ game: filter.game, title: e.target.value })}
              placeholder="Search"
              className="search-input shadow-none"
            />
          </Col>
          <Col xs={6}></Col>
          <Col className="d-flex justify-content-end">
            <div class="btn-group dropdown-menu-end">
              <MyButton additionalCl={`${classes.filter_btn}`} data-bs-toggle="dropdown" aria-expanded="false">
                {filter.game === '' ?
                  "Game"
                  : filter.game
                }
              </MyButton>
              <ul className={`${classes.filter_ul} dropdown-menu`}>
                <li>
                  <MyDataList filter={filter} setFilter={setFilter} gamesFilter={gamesFilter} />
                </li>
              </ul>
            </div>

          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TournamentFilter;
