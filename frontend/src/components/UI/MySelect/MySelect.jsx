import React, {useState} from "react";


const MySelect = ({options, defaultValue, value, onChange}) => { 

    return (
        <select 
            Style="background: rgb(33, 37, 41); border-color: #1D8044; color: grey; border-radius: 4px; padding: 8px;"
            value={value}
            onChange={event => onChange(event.target.value)}
        >
            <option value='' disabled>{defaultValue}</option>
            {options.map(option =>
                     <option key={option.value} value={option.value}>{option.name}</option>
            )}
            
        </select>
    );
};

export default MySelect;