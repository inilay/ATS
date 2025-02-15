import React, { useState } from "react";
import BracketWrapper from "./UI/BracketWrapper/BracketWrapper";
import { Bracket, SeedsList, Round } from "./UI/Round/round";
import MyMatch from "./UI/Match/Match";

const SingleEl = ({ bracket, id, owner }) => {
    const [rounds, setBracket] = useState(bracket);

    const handleBracketChange = (data) => {
        setBracket(data);
    };

    return (
        <BracketWrapper>
            <Bracket mobileBreakpoint={992}>
                {rounds.map((round, i) => (
                    <Round key={round.title} mobileBreakpoint={992}>
                        <SeedsList>
                            {round.seeds.map((seed, idx) => (
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
        </BracketWrapper>
    );
};

export default SingleEl;
