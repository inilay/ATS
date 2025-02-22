import { useState, useContext, Fragment } from "react";
import classes from "./BracketController.module.css";
import SingleElimination from "../Brackets/SE/SingleElimination";
import DoubleElimination from "../Brackets/DE/DoubleElimination";
import RoundRobin from "../Brackets/RR/RoundRobin";
import Swiss from "../Brackets/SW/Swiss";
import { useSelector, useDispatch } from "react-redux";

const BracketController = () => {
    const final_bracket = useSelector((state) => state.bracket.brackets).filter((br) => [1, 2, 3, 4].includes(br.type));
    const group_brackets = useSelector((state) => state.bracket.brackets).filter((br) =>
        [5, 6, 7, 8].includes(br.type),
    );

    return (
        <div className={`${classes.bracket_control_container}`}> 
            {group_brackets.map((br, i) => {
                if ((br.type === 1) | (br.type === 5)) {
                    return (
                        <Fragment>
                            <div className={`${classes.stage}`}>Group {i + 1}</div>
                            <SingleElimination bracket={br.rounds} bracketId={br.id} />
                        </Fragment>
                    );
                } else if ((br.type === 2) | (br.type === 6)) {
                    return (
                        <Fragment>
                            <div className={`${classes.stage}`}>Group {i + 1}</div>
                            <DoubleElimination bracket={br.rounds} bracketId={br.id} />
                        </Fragment>
                    );
                } else if ((br.type == 3) | (br.type === 7)) {
                    return (
                        <Fragment>
                            <div className={`${classes.stage}`}>Group {i + 1}</div>
                            <RoundRobin bracket={br.rounds} bracketId={br.id} />
                        </Fragment>
                    );
                } else if ((br.type == 4) | (br.type === 8)) {
                    return (
                        <Fragment>
                            <div className={`${classes.stage}`}>Group {i + 1}</div>
                            <Swiss bracket={br.rounds} bracketId={br.id} />
                        </Fragment>
                    );
                }
            })}
            {group_brackets.length > 0 && <div className={`${classes.stage}`}>Final</div>}
            {final_bracket.map((br) => {
                if ((br.type === 1) | (br.type === 5)) {
                    return <SingleElimination bracket={br.rounds} bracketId={br.id} />;
                } else if ((br.type === 2) | (br.type === 6)) {
                    return <DoubleElimination bracket={br.rounds} bracketId={br.id} />;
                } else if ((br.type == 3) | (br.type === 7)) {
                    return <RoundRobin bracket={br.rounds} bracketId={br.id} />;
                } else if ((br.type == 4) | (br.type === 8)) {
                    return <Swiss bracket={br.rounds} bracketId={br.id} />;
                }
            })}
        </div>
    );
};

export default BracketController;
