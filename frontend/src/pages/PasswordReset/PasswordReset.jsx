import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import MyFormGroupInput from "../../components/UI/MyFormGroupInput/MyFormGroupInput";
import MyButton from "../../components/UI/MyButton/MyButton";
import profileApi from "../../services/api/profileApi";
import axios from "axios";

const PasswordReset = () => {
    const api = axios();
    const handleResetSubmit = () => {
        const response = profileApi.resetPassword(api, email);
    };

    const [email, setEmail] = useState({ email: "" });

    const inputChangeHandler = (inputValue) => {
        const { name, value } = inputValue;
        setEmail({ [name]: value });
        setValue(name, value);
    };

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onBlur" });

    return (
        <section>
            <div>
                <div className="log_div position-absolute top-50 start-50 translate-middle">
                    <Form onSubmit={handleSubmit(handleResetSubmit)}>
                        <MyFormGroupInput
                            label="Email"
                            name="email"
                            errors={errors}
                            register={register}
                            validationSchema={{
                                required: "⚠ This input is required.",
                                pattern: {
                                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    message: "⚠ Invalid email.",
                                },
                            }}
                            onChange={inputChangeHandler}
                        ></MyFormGroupInput>
                        <MyButton additionalCl={"btn-md"} type="submit">
                            Отправить
                        </MyButton>
                    </Form>
                </div>
            </div>
        </section>
    );
};

export default PasswordReset;
