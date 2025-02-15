import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFetching } from "../../hooks/useFetching";
import { getPageCount } from "../../utils/pages";
import Loader from "../../components/UI/Loader/Loader";
import TournamentList from "../../components/TournamentList/TournamentList.jsx";
import TournamentFilter from "../../components/TournamentFilter/TournamentFilter.jsx";
import { useObserver } from "../../hooks/useObserver";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../../styles/App.css";
import tournamentApi from "../../services/api/tournamentApi.js";
import axios from "axios";

function Tournaments() {
    const [tournaments, setTournaments] = useState([]);
    const [filter, setFilter] = useState({ game: null, title: null });
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(12);
    const [page, setPage] = useState(1);
    const lastElement = useRef();
    const [searchParams, setSearchParams] = useSearchParams();
    const public_api = axios;

    const [fetchPosts, isPostLoadind, postError] = useFetching(async (limit, page, title = "", game = "") => {
        const response = await tournamentApi.getAllTournaments(public_api, limit, page, title, game);
        if (page === 1) {
            setTournaments([...response.data.results]);
        } else {
            setTournaments([...tournaments, ...response.data.results]);
        }
        setTotalPages(getPageCount(response.data.count, limit));
    });

    useObserver(lastElement, page < totalPages, isPostLoadind, () => {
        setPage(page + 1);
    });

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            // setSearchParams({ "title": filter.title, "game": filter.game });
            console.log("filter", filter);

            if (filter.title !== null || filter.game !== null) {
                // setTournaments([]);
                setPage(1);
                fetchPosts(limit, page, filter.title, filter.game);
                setSearchParams({ title: filter.title, game: filter.game });
            }
        }, 600);

        return () => {
            clearTimeout(timeOutId);
        };
    }, [filter.title, filter.game]);

    useEffect(() => {
        console.log("page");
        if (searchParams !== 0) {
            fetchPosts(
                limit,
                page,
                searchParams.get("title") === "null" ? "" : searchParams.get("title"),
                searchParams.get("game") === "null" ? "" : searchParams.get("game"),
            );
        } else {
            fetchPosts(limit, page);
        }
    }, [page, limit]);

    return (
        <section className="container tournaments_section pb-5">
            <TournamentFilter filter={filter} setFilter={setFilter} />

            <Row>
                <Col lg={12}>
                    <TournamentList tournaments={tournaments} title="title" />
                </Col>
            </Row>

            {isPostLoadind && (
                <div className="loader">
                    <Loader />
                </div>
            )}
            <div ref={lastElement} className="invisible-div"></div>
        </section>
    );
}

export default Tournaments;
