import React, { useEffect, useRef, useState } from "react";
import PostService from "../API/PostService";
import { useFetching } from "../hooks/useFetching";
import { getPageCount } from "../utils/pages";
import Loader from "../components/UI/Loader/Loader";
import TournamentList from "../components/TournamentList";
import TournamentFilter from "../components/TournamentFilter";
import { useTournaments } from "../hooks/useTournaments";
import Pagination from "../components/UI/Pagination/Pagination"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../styles/App.css";

function PaginationPage() {
  const [tournaments, setTournaments] = useState([]);
  const [filter, setFilter] = useState({ sort: "", query: "" });
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(2);
  const [page, setPage] = useState(0);
  const lastElement = useRef();

  const sortedAndSearchedTournaments = useTournaments(
    tournaments,
    filter.sort,
    filter.query
  );

  const [fetchPosts, isPostLoadind, postError] = useFetching(async () => {
    const response = await PostService.getAllTournaments(limit, page);
    setTournaments([...response.data.results]);
    setTotalPages(getPageCount(response.data.count, limit));
  });

  const changePage = (page) => {
    setPage(page);
  };
  
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
            tournaments={sortedAndSearchedTournaments}
            title="title"
          />
        </Col>
      </Row>
      )}
     <Pagination totalPages={totalPages} page={page} changePage={changePage}/>
    </section>
  );
}

export default PaginationPage;
