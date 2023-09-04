import React, { useState } from "react";
import BracketWrapper from "./UI/BracketWrapper/BracketWrapper";
import { Bracket, SeedsList, Round } from "./UI/Round/round";
import MyMatch from "./UI/Match/Match";

const DoubleEl = ({ bracket, id, owner }) => {

  const [rounds, setBracket] = useState(bracket);

  const handleBracketChange = (data) => {
    setBracket(data);
  };

  return (
    <BracketWrapper>
      <Bracket mobileBreakpoint={992}>
        {rounds.upper_rounds.map((round, i) => (
          <Round key={round.title} mobileBreakpoint={992}>
            <SeedsList>
              {round === rounds.upper_rounds[rounds.upper_rounds.length - 2]
                ? round.seeds.map((seed, idx) => (
                    <MyMatch
                      key={idx}
                      owner={owner}
                      match_id={idx}
                      round_id={i}
                      id={id}
                      seed={seed}
                      onPatch={handleBracketChange}
                      single={true}
                    />
                  ))
                : round.seeds.map((seed, idx) => (
                    <MyMatch
                      key={idx}
                      owner={owner}
                      match_id={idx}
                      round_id={i}
                      id={id}
                      seed={seed}
                      onPatch={handleBracketChange}
                    />
                  ))}
            </SeedsList>
          </Round>
        ))}
      </Bracket>
      <Bracket mobileBreakpoint={992}>
        {rounds.lower_rounds.map((round, indx) => (
          <Round key={round.title} mobileBreakpoint={992}>
            <SeedsList>
              {indx % 2 === 0
                ? round.seeds.map((seed, idx) => (
                    <MyMatch
                      key={idx}
                      owner={owner}
                      id={id}
                      seed={seed}
                      onPatch={handleBracketChange}
                      single={true}
                    />
                  ))
                : round.seeds.map((seed, idx) => (
                    <MyMatch
                      key={idx}
                      owner={owner}
                      id={id}
                      seed={seed}
                      onPatch={handleBracketChange}
                    />
                  ))}
            </SeedsList>
          </Round>
        ))}
      </Bracket>
    </BracketWrapper>
  );
};

export default DoubleEl;
