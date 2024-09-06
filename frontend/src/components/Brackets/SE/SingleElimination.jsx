import { useState, useContext, Fragment } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import MatchInfoIcon from "../../../assets/svg/MatchInfoIcon";
import MatchJudgeIcon from "../../../assets/svg/MatchJudgeIcon";
import classes from "./SingleElimination.module.css";


const SingleElimination = ({bracket}) => {
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

  const t = 2

  // const [bracket, setBracket] = useState([ 
  //   [ [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'},], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'},],[{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'},], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'},] ],
  //   // [ [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'}, ], [{'name': 'Bill'}, {'name': 'Tom'}, {'name': 'Bill'}, {'name': 'Tom'},], [{'name': 'Gin'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'},] ],
  //   [ [{'name': 'Bill'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'},], [{'name': 'Bill'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Tom'},] ],
  //   [ [{'name': 'Bill'}, {'name': 'Add'}, {'name': 'Bill'}, {'name': 'Add'}] ]
  //  ]);

  console.log('bracket', bracket);

  return (
    <div>
      <div className={`${classes.bracket}`}>
        {bracket.map((round) => (
          <Fragment>
          <div className={`${classes.column}`}>
          { round.matches.map((match) => (
              <div className={`${classes.match}`}>
                {
                  match.info.map((team) => (
                    <div className={`${classes.team}`}>
                      <div className={`${classes.name}`}>{team.participant}</div>
                      <div className={`${classes.score}`}>{team.participant_scoore}</div>
                    </div>
                  ))
                }
                <div className={classes.button_container}>
                  <button
                    className={classes.icon_button}
                  >
                    <MatchInfoIcon />
                  </button>
                  <button
                    className={classes.icon_button}
                  >
                    <MatchJudgeIcon />
                  </button>
                </div>
                <div className={`${classes.match_lines}`}>
                  <div className={`${classes.line} ${classes.one}`}></div>
                </div>
                <div className={`${classes.match_lines} ${classes.alt}`}>
                  <div className={`${classes.line} ${classes.one}`}></div>
                </div>
              </div>
          )
          )}
          </div>
          {round.matches.length >= 2 &&
            <div className={`${classes.column_lines_wrapper}`}>
              {[...Array.from(Array(round.matches.length).keys())].map((num, i) => 
                <div 
                  className={`${(round.matches.length > 2 && (i % t === 0 || i % t === t-1)) ? i % t === 0 ? classes.column_lines_first : classes.column_lines_last : classes.column_lines}`}
                  >
                </div>)}
            </div>
          }
        </Fragment>
        )

        )}
      </div>
    </div>
  );
};

export default SingleElimination;
