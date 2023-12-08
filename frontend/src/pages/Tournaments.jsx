import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from 'react-router-dom';
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
  const [filter, setFilter] = useState({ game: "", title: "" });
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(0);
  const lastElement = useRef();

  const [searchParams, setSearchParams] = useSearchParams();

  // const sortedAndSearchedTournaments = useTournaments(
  //   tournaments,
  //   filter.sort,
  //   filter.title
  // );

  const [fetchPosts, isPostLoadind, postError] = useFetching(async () => {
    // searchParams.get('game')
    const response = await PostService.getAllTournaments(limit, page, filter.title, filter.game);
    setTournaments([ ...response.data.results]);
    console.log(response.data.results)
    setTotalPages(getPageCount(response.data.count, limit));

  });

  useObserver(lastElement, page < totalPages, isPostLoadind, () => {
    setPage(page + 1);
  });

  // useEffect(() => {
  //   setFilter({"title": searchParams.get('title'), "game": searchParams.get('game')})
  // }, []);

  useEffect(() => {

    const timeOutId = setTimeout(() => {
      if (filter.title !== "") {
        setSearchParams({"title": filter.title, "game": filter.game});
        
        fetchPosts();
      }
    }, 700);

    return () => clearTimeout(timeOutId);
  }, [filter]);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  return (
    <section className="container tournaments_section pb-5">
      {postError && <h1>Error ${postError}</h1>}

      <TournamentFilter filter={filter} setFilter={setFilter} />
      
      {isPostLoadind ? 
        (<div className="loader">
          <Loader />
        </div>)
      : (
      <Row>
        <Col lg={12}>
          <TournamentList
            tournaments={tournaments}
            title="title"
          />
        </Col>
      </Row>
      )}
      <div ref={lastElement} className="invisible-div"></div>
    </section>
  );
}

export default Tournaments;
