import React from "react";
import DefaultTournamentIcon from "../../assets/svg/DefaultTournamentIcon";
import classes from "./TournamentList.module.css";
import { Link } from "react-router-dom";

const TournamentList = ({ tournaments }) => {
    if (!tournaments?.length) {
        return <h1 style={{ textAlign: "center" }}>{/* Турниры не найдены! */}</h1>;
    }

    return (
        <div className="row">
            {tournaments?.map((post) => (
                <div className="col-lg-3 col-md-6 mt-4" key={post.link}>
                    <Link to={`/tournament/${post.link}`}>
                        <div className="card tournament_card">
                            {post.poster == null ? (
                                <div className={`${classes.poster}`}>
                                    <DefaultTournamentIcon />
                                </div>
                            ) : (
                                <img src={post.poster} className={`${classes.poster}`} alt="card text" />
                            )}
                            <div className="tournaments_card_body_bottom">
                                <h4 className="card-title">{post.title}</h4>
                                <p className="card-text">Game: {post.game}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default TournamentList;
