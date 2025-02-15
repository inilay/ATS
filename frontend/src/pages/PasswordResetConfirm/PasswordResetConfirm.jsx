import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import MyButton from "../../components/UI/MyButton/MyButton";
import axios from "axios";
import profileApi from "../../services/api/profileApi";

const PasswordResetConfirm = () => {
    const params = useParams();
    const api = axios();
    const [new_password, setPassword] = useState("");
    const [re_new_password, setRePassword] = useState("");

    const handlePasswordResetSubmit = (e) => {
        e.preventDefault();
        console.log({
            uid: params.uid,
            token: params.token,
            new_password: new_password,
            re_new_password: re_new_password,
        });
        const response = profileApi.resetPasswordConfirm(api, {
            uid: params.uid,
            token: params.token,
            new_password: new_password,
            re_new_password: re_new_password,
        });
    };

    const newPasswordHandler = (e) => {
        setPassword(e.target.value);
        setValue("new_password", e.target.value);
    };

    const newRePasswordHandler = (e) => {
        setRePassword(e.target.value);
        setValue("re_new_password", e.target.value);
    };

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onBlur" });

    return (
        <section>
            <div>
                <div className="log_div position-absolute top-50 start-50 translate-middle">
                    <Form onSubmit={handleSubmit(handlePasswordResetSubmit)}>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="text"
                                {...register("new_password", {
                                    required: "⚠ This input is required.",
                                })}
                                className="shadow-none my_log_input"
                                onChange={(e) => newPasswordHandler(e)}
                            />
                            {errors.new_password && <p role="alert">{errors.new_password?.message}</p>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control
                                type="text"
                                {...register("re_new_password", {
                                    required: "⚠ This input is required.",
                                    validate: (value) => {
                                        const { new_password } = getValues();
                                        return new_password === value || "⚠ Passwords should match!";
                                    },
                                })}
                                className="shadow-none my_log_input"
                                onChange={(e) => newRePasswordHandler(e)}
                            />
                            {errors.re_new_password && <p role="alert">{errors.re_new_password?.message}</p>}
                        </Form.Group>
                        <MyButton additionalCl={"btn-md"} type="submit">
                            Отправить
                        </MyButton>
                    </Form>
                </div>
            </div>
        </section>
    );
};

export default PasswordResetConfirm;
