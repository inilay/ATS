import React from "react";
import DefaultTournamentIcon from "../../assets/svg/DefaultTournamentIcon";
import classes from './TournamentList.module.css'


const TournamentList = ({ tournaments }) => {
  if (!tournaments.length) {
    return <h1 style={{ textAlign: "center" }}>{/* Турниры не найдены! */}</h1>;
  }

  return (
    <div className="row">
      {tournaments.map((post) => (
        <div className="col-lg-3 col-md-6 mt-4" key={post.slug}>
          <a href={`/tournament/${post.slug}`}>
            <div className="card tournament_card">
              {post.poster == null ? 
                <div className={`${classes.poster}`}>
                  <DefaultTournamentIcon />
                </div>
               : <img
                  src={post.poster}
                  className={`${classes.poster}`}
                  alt="card text"
                />
              }
              <div className="card-body tournaments_card_body">
                <h4 className="card-title">{post.title}</h4>
                <p className="card-text">Game: {post.game}</p>
                <p className="card-text">Prize: {post.prize}</p>
              </div>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export default TournamentList;
