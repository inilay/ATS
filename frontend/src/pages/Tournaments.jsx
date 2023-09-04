import React, { useEffect, useRef, useState } from "react";
import PostService from "../API/PostService";
import { useFetching } from "../hooks/useFetching";
import { getPageCount } from "../utils/pages";
import Loader from "../components/UI/Loader/Loader";
import TournamentList from "../components/TournamentList";
import TournamentFilter from "../components/TournamentFilter";
import { useObserver } from "../hooks/useObserver";
import { useTournaments } from "../hooks/useTournaments";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../styles/App.css";

function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [filter, setFilter] = useState({ sort: "", query: "" });
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(0);
  const lastElement = useRef();

  const sortedAndSearchedTournaments = useTournaments(
    tournaments,
    filter.sort,
    filter.query
  );

  const [fetchPosts, isPostLoadind, postError] = useFetching(async () => {
    const response = await PostService.getAllTournaments(limit, page);
    setTournaments([...tournaments, ...response.data.results]);
    setTotalPages(getPageCount(response.data.count, limit));
  });

  const changePage = (page) => {
    setPage(page);
  };

  useObserver(lastElement, page < totalPages, isPostLoadind, () => {
    setPage(page + 1);
  });
  console.log(tournaments)
  useEffect(() => {
    fetchPosts();
  }, [page]);

  return (
    <section className="container tournaments_section pb-5">
      {postError && <h1>Error ${postError}</h1>}
      <TournamentFilter filter={filter} setFilter={setFilter} />

      <Row>
        <Col lg={12}>
          <TournamentList
            tournaments={sortedAndSearchedTournaments}
            title="title"
          />
        </Col>
      </Row>
      <div ref={lastElement} className="invisible-div"></div>
      {isPostLoadind && (
        <div className="loader">
          <Loader />
        </div>
      )}
    </section>
  );
}

export default Tournaments;
