import React, { useState } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import classes from "./MyRadioButton.module.css";


function MyRadioButton({radios, onChange, defValue}) {

  const [radioValue, setRadioValue] = useState(defValue);


  const handleButtonChange = (event) => {
    setRadioValue(event.currentTarget.value)
    onChange(event.currentTarget.value)
  }

  return (
    <>
      <ButtonGroup>
        {radios.map((radio, idx) => (
          <ToggleButton
            className={classes.myRadioButton}
            key={idx}
            id={`radio-${idx}`}
            type="radio"
            variant={idx % 2 ? 'outline-success' : 'outline-danger'}
            name="radio"
            value={radio.value}
            checked={radioValue === radio.value}
            onChange={handleButtonChange}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </>
  );
}


export default MyRadioButton