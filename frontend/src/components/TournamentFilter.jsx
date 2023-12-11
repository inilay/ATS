import React, {useState, useEffect} from "react";
import MySelect from "./UI/MySelect/MySelect";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from 'react-bootstrap/Dropdown';
import MyDataList from "./UI/MyDataList/MyDataList";
import MyButton from "./UI/MyButton/MyButton";

const TournamentFilter = ({ filter, setFilter }) => {
  const [text, setText] = useState('Game');

  const handleChange = (e) => {
    e.preventDefault();
    console.log(e.target.value)
    // setSearchInput(e.target.value);
  };

  // const [query, setQuery] = useState("");
  // const [displayMessage, setDisplayMessage] = useState("");



  return (
    <div className="row ">
      <div className="col-lg-12 col-md-12">
        <Row>
          <Col>
            <input
              value={filter.title}
              onChange={(e) => setFilter({game: filter.game, title: e.target.value })}
              placeholder="Search for tournaments"
              className="search-input my-2 shadow-none"
            />
          </Col>
          <Col xs={6}></Col>
          <Col className="d-flex justify-content-end">
          <Dropdown>
            <Dropdown.Toggle as={MyButton} id="dropdown-basic">
              Game
            </Dropdown.Toggle>
            <Dropdown.Menu className="">
              <li>
                <MyDataList filter={filter} setFilter={setFilter}/>
              </li>
            </Dropdown.Menu>
          </Dropdown>
            {/* <MySelect
                value={filter.sort}
                onChange={selectedSort => setFilter({...filter, sort: selectedSort})}
                defaultValue="Игра"
            
                options={[
                    {value: 'title', name: 'По названию'},
                    {value: 'body', name: 'По описанию'},
                ]}
            /> */}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TournamentFilter;
