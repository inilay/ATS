import classes from "./SortebleTable.module.css";
import React, { useState, useEffect } from "react";

const TableBody = ({ tableData, columns }) => {
    const [table, setTable] = useState(tableData);

    console.log(tableData);
    return (
        <tbody className={classes.tableBody}>
            {tableData.map((data) => {
                return (
                    <tr key={data.participant}>
                        {columns.map(({ accessor }) => {
                            const tData = data[accessor] ? data[accessor] : "0";
                            return (
                                <td style={{ paddingLeft: "2rem" }} key={accessor}>
                                    {Array.isArray(tData) ? tData.join("/") : tData}
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
        </tbody>
    );
};

export default TableBody;
