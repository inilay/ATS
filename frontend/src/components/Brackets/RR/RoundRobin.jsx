import { useState, useContext, Fragment } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import classes from "./RoundRobin.module.css";


const RoundRobin = ({bracket}) => {
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
    <section>
      <div className={`${classes.bracket}`}>
        {bracket.map((round) => (
          <Fragment>
            <div className={`${classes.row}`}>
            { round.matches.map((match) => (
                <div className={`${classes.match}`}>
                    {
                    match.info.map((team) => (
                        <div className={`${classes.team}`}>
                        <span className={`${classes.name}`}>{team.participant}</span>
                        <span className={`${classes.score}`}>{team.participant_scoore}</span>
                        </div>
                    ))
                    }
                </div>
            )
            )}
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
};

export default RoundRobin;
