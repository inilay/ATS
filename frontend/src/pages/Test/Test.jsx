import { useState, useContext, Fragment } from "react";
import { AuthContext } from "../../context";
import { useNavigate } from "react-router-dom";

import classes from "./Test.module.css";

const Test = () => {
    // bracket [
    //   round [
    //     match [

    //     ]
    //   ]
    // ]
    // const [bracket, setBracket] = useState([ [ [{'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Gin'}, {'name': 'Add'}], [{'name': 'Bill'}, {'name': 'Tom'}], [{'name': 'Gin'}, {'name': 'Add'}], [{'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Gin'}, {'name': 'Add'}], [{'name': 'Bill'}, {'name': 'Tom'}], [{'name': 'Gin'}, {'name': 'Add'}] ],
    //                                          [ [{'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Gin'}, {'name': 'Add'}]],
    //                                         //  [ [{'name': 'Bill'}, {'name': 'Add'}], [{'name': 'Bill'}, {'name': 'Add'}] ],
    //                                          [ [{'name': 'Bill'}, {'name': 'Add'}] ]
    //                                         ]);

    // const [bracket, setBracket] = useState([
    //   [ [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'},], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'},],[{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'},], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'},] ],
    //   [ [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'},], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'},] ],
    //   [ [{'name': 'Bill'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'},], [{'name': 'Bill'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'},] ],
    //   [ [{'name': 'Bill'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Add'}] ]
    //  ]);

    const t = 4;

    const [bracket, setBracket] = useState([
        [
            [{ name: "Bill" }, { name: "Tom" }, { name: "Bill" }, { name: "Tom" }],
            [{ name: "Gin" }, { name: "Add" }, { name: "Bill" }, { name: "Tom" }],
            [{ name: "Bill" }, { name: "Tom" }, { name: "Bill" }, { name: "Tom" }],
            [{ name: "Gin" }, { name: "Add" }, { name: "Bill" }, { name: "Tom" }],
            [{ name: "Bill" }, { name: "Tom" }, { name: "Bill" }, { name: "Tom" }],
            [{ name: "Gin" }, { name: "Add" }, { name: "Bill" }, { name: "Tom" }],
            [{ name: "Bill" }, { name: "Tom" }, { name: "Bill" }, { name: "Tom" }],
            [{ name: "Gin" }, { name: "Add" }, { name: "Bill" }, { name: "Tom" }],
        ],
        // [ [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'},], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'},] ],
        [
            [{ name: "Bill" }, { name: "Add" }, { name: "Bill" }, { name: "Tom" }],
            [{ name: "Bill" }, { name: "Add" }, { name: "Bill" }, { name: "Tom" }],
        ],
        [[{ name: "Bill" }, { name: "Add" }, { name: "Bill" }, { name: "Add" }]],
    ]);

    console.log("bracket", bracket);

    return (
        <section>
            <div className={`${classes.bracket}`}>
                {bracket.map((round) => (
                    <Fragment>
                        <div className={`${classes.column}`}>
                            {round.map((match) => (
                                <div className={`${classes.match}`}>
                                    {match.map((team) => (
                                        <div className={`${classes.team}`}>
                                            <span className={`${classes.name}`}>{team.name}</span>
                                            <span className={`${classes.score}`}>0</span>
                                        </div>
                                    ))}
                                    <div className={`${classes.match_lines}`}>
                                        <div className={`${classes.line} ${classes.one}`}></div>
                                    </div>
                                    <div className={`${classes.match_lines} ${classes.alt}`}>
                                        <div className={`${classes.line} ${classes.one}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {round.length >= 2 && (
                            <div className={`${classes.column_lines_wrapper}`}>
                                {[...Array.from(Array(round.length).keys())].map((num, i) => (
                                    <div
                                        className={`${round.length > 2 && (i % t === 0 || i % t === t - 1) ? (i % t === 0 ? classes.column_lines_first : classes.column_lines_last) : classes.column_lines}`}
                                    ></div>
                                ))}
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
        </section>
    );
};

export default Test;
