import React from 'react';
import Form from 'react-bootstrap/Form';
import classes from "./MyFormGroupInput.module.css";


const MyFormGroupInput = ({ label, defaultValue, name, as, type, onChange, register, validationSchema, errors, className}) => {

    const inputChangeHandler = (event) => {
        onChange(event.target)
    }

    return (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Control
                {...register(name, validationSchema)}
                type={type}
                as={as}
                onChange={inputChangeHandler}
                defaultValue={defaultValue}
                className={`${classes.myInput} ${className} shadow-none`}
            />
        {errors[name] && <p className={classes.warningP} role="alert">{errors[name]?.message}</p>}
        </Form.Group>
    );
};

export default MyFormGroupInput;