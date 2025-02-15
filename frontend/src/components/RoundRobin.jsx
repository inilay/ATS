import MyRoundRobinMatch from "./UI/MyRoundRobinMatch/MyRoundRobinMatch";
import MySortebleTable from "./UI/SortebleTable/SortebleTable";
import React, { useState } from "react";
import BracketWrapper from "./UI/BracketWrapper/BracketWrapper";

const RoundRobin = ({ id, bracket, owner }) => {
    console.log("work i");
    const [bracketAll, setBracketAll] = useState(bracket);
    const [table, setTable] = useState(bracket.table);

    const handleBracketChange = (data) => {
        setBracketAll(data);
        setTable(data.table);
    };

    const columns = [
        { label: "Participant", accessor: "participant", sortable: true },
        { label: "Match W-L", accessor: "match_w_l", sortable: false },
        { label: "Set win", accessor: "win", sortable: true },
        { label: "Set loose", accessor: "loose", sortable: true },
        { label: "Set draw", accessor: "draw", sortable: true },
        { label: "Berger", accessor: "berger", sortable: true },
        {
            label: "Scores",
            accessor: "scores",
            sortable: true,
            sortbyOrder: "desc",
        },
    ];

    return (
        <BracketWrapper>
            <div style={{ minWidth: "80rem" }}>
                {bracketAll.rounds.map((round, i) => (
                    <div className="row mb-3" key={i}>
                        {round.map((match, j) => (
                            <MyRoundRobinMatch
                                owner={owner}
                                id={id}
                                match={match}
                                match_id={j}
                                round_id={i}
                                key={match.id}
                                onPatch={handleBracketChange}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <MySortebleTable table={table} columns={columns} />
        </BracketWrapper>
    );
};

export default RoundRobin;
