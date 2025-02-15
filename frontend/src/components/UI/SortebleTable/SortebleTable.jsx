import React, { useState, useEffect } from "react";
import TableBody from "./TableBody";
import TableHead from "./TableHead";

const MySortebleTable = ({ table, columns }) => {
    // const data = ([{participant: "aboba", match_w_l: [0, 0], win: 1, loose: 1, draw: 1, scores: 4 },
    //                 { participant: "ibib", match_w_l: [1, 2], win: 1, loose: 2, scores: 2 },
    //                 { participant: "lulu", match_w_l: [3, 0], win: 1, loose: 0,  scores: 5 },
    //               ]);

    // const [tableData, handleSorting] =useSortableTable(table, columns)

    useEffect(() => {
        setTableData(getDefaultSorting(table, columns));
    }, [table]);

    const [tableData, setTableData] = useState(getDefaultSorting(table, columns));

    function getDefaultSorting(defaultTableData, columns) {
        const sorted = [...defaultTableData].sort((a, b) => {
            const filterColumn = columns.filter((column) => column.sortbyOrder);

            let { accessor = "id", sortbyOrder = "asc" } = Object.assign({}, ...filterColumn);

            if (a[accessor] === null) return 1;
            if (b[accessor] === null) return -1;
            if (a[accessor] === null && b[accessor] === null) return 0;

            const ascending = a[accessor].toString().localeCompare(b[accessor].toString(), "en", {
                numeric: true,
            });

            return sortbyOrder === "asc" ? ascending : -ascending;
        });
        return sorted;
    }

    const handleSorting = (sortField, sortOrder) => {
        if (sortField) {
            const sorted = [...tableData].sort((a, b) => {
                if (a[sortField] === null) return 1;
                if (b[sortField] === null) return -1;
                if (a[sortField] === null && b[sortField] === null) return 0;
                return (
                    a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
                        numeric: true,
                    }) * (sortOrder === "asc" ? 1 : -1)
                );
            });
            setTableData(sorted);
        }
    };

    return (
        <>
            <table className="table">
                <TableHead {...{ columns, handleSorting }} />
                <TableBody {...{ columns, tableData }} />
            </table>
        </>
    );
};

export default MySortebleTable;
