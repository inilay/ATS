import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MyDataList from "../UI/MyDataList/MyDataList";
import MyButton from "../UI/MyButton/MyButton";
import classes from "./TournamentFilter.module.css";
import auxiliaryApi from "../../services/api/auxiliaryApi";
import axios from "axios";

const TournamentFilter = ({ filter, setFilter }) => {
    const [gamesFilter, setGamesFilter] = useState([]);
    const [openFilter, setOpenFilter] = useState(false);
    const [temporaryFilter, setTemporaryFilter] = useState("");
    const api = axios;

    useEffect(() => {
        console.log("useEffect");

        const response = auxiliaryApi.getAllGames(api).then((response) => {
            setGamesFilter(response.data);
            console.log(response.data);
        });
    }, []);

    const onChange = (event) => {
        setFilter({ game: event.target.value, title: filter.title });
        console.log(event.target.value);
    };

    const filterHandler = () => {
        if (!openFilter) {
            setOpenFilter(!openFilter);
        } else {
            setOpenFilter(!openFilter);
            setFilter({ game: "", title: filter.title });

            console.log("filter", filter);
        }
    };

    return (
        <div className={`${classes.filter_container}`}>
            <input
                value={filter.title}
                onChange={(e) => setFilter({ game: filter.game, title: e.target.value })}
                placeholder="Search"
                className={`${classes.filter_ul} search-input shadow-none`}
            />
            <div className={`${classes.game_filter_container}`}>
                {openFilter && (
                    <div className={`${classes.filter_ul}`}>
                        <MyDataList filter={filter} setFilter={setFilter} gamesFilter={gamesFilter} />
                    </div>
                )}
                <MyButton additionalCl={`${classes.filter_btn}`} onClick={() => filterHandler()}>
                    {!openFilter ? "Game" : "Clear"}
                    {/* {filter.game === '' && <input onChange={e => setFilter(e)}></input>} */}
                </MyButton>
            </div>
        </div>
    );
};

export default TournamentFilter;
