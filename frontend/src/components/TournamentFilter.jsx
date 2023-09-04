import React from "react";
import MySelect from "./UI/MySelect/MySelect";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const TournamentFilter = ({ filter, setFilter }) => {
  return (
    <div className="row ">
      <div className="col-lg-12 col-md-12">
        <Row>
          <Col>
            <input
              value={filter.query}
              onChange={(e) => setFilter({ ...filter, query: e.target.value })}
              placeholder="Search for tournaments"
              className="search-input my-2 shadow-none"
            />
          </Col>
          <Col xs={6}></Col>
          <Col className="d-flex justify-content-end">
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
