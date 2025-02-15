import React, { useState } from "react";

function Checkbox() {
    const [checked, setChecked] = useState(false);
    const handleChange = () => {
        setChecked(!checked);
    };

    return (
        <div>
            <p>{checked ? "Checked" : "Not checked"}</p>
        </div>
    );
}

export default Checkbox;
