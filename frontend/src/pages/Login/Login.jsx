import React, { useContext } from "react";
import { AuthContext } from "../../context";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import MyFormGroupInput from "../../components/UI/MyFormGroupInput/MyFormGroupInput";
import { useForm } from "react-hook-form";
import MyButton from "../../components/UI/MyButton/MyButton";
import MyCard from "../../components/UI/MyCard/MyCard";
import Card from "react-bootstrap/Card";
import classes from "./Login.module.css";


const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const [state, setState] = useState({ email: "", password: "" });

  const handleLoginSubmit = () => {
    loginUser(state.email, state.password);
  };

  const inputChangeHandler = (inputValue) => {
    const { name, value } = inputValue;
    setState({ ...state, [name]: value });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  return (
    <section>
      <div>
        <div className={`${classes.login_form}`}>
          <Form onSubmit={handleSubmit(handleLoginSubmit)}>
          <MyCard>
            <Card.Header className="card-header-text">Log in</Card.Header>
            <Card.Body>
            <MyFormGroupInput
              label="Email"
              name="email"
              errors={errors}
              register={register}
              validationSchema={{
                required: "⚠ This input is required.",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "⚠ Invalid email.",
                },
              }}
              onChange={inputChangeHandler}
            ></MyFormGroupInput>
            <MyFormGroupInput
              label="Password"
              type="password"
              name="password"
              errors={errors}
              register={register}
              validationSchema={{
                required: "⚠ This input is required.",
              }}
              onChange={inputChangeHandler}
            ></MyFormGroupInput>
            <p>
              <a href="/password_reset">Forgot password ?</a>
            </p>
            </Card.Body>
          </MyCard>
          <div className='mt-3'>
            <MyButton additionalCl={"btn-md"} type="submit">
              Log in
            </MyButton>
          </div>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Login;
