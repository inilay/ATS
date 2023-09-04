import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import PostService from "../API/PostService";
import { useForm } from "react-hook-form";
import MyButton from "../components/UI/MyButton/MyButton";

const PasswordResetConfirm = () => {
  const params = useParams();
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
    const response = PostService.resetPasswordConfirm({
      uid: params.uid,
      token: params.token,
      new_password: new_password,
      re_new_password: re_new_password,
    });
  };

  const {
    register,
    handleSubmit,
    getValues,
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
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.new_password && (
                <p role="alert">{errors.new_password?.message}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="text"
                {...register("re_new_password", {
                  required: "⚠ This input is required.",
                  validate: (value) => {
                    const { new_password } = getValues();
                    return (
                      new_password === value || "⚠ Passwords should match!"
                    );
                  },
                })}
                className="shadow-none my_log_input"
                onChange={(e) => setRePassword(e.target.value)}
              />
              {errors.re_new_password && (
                <p role="alert">{errors.re_new_password?.message}</p>
              )}
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
