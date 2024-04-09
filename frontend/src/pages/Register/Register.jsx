import { useState, useContext } from "react";
import { AuthContext } from "../../context";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import MyButton from "../../components/UI/MyButton/MyButton";
import MyFormGroupInput from "../../components/UI/MyFormGroupInput/MyFormGroupInput";
import MyModal from "../../components/UI/MyModal/MyModal";
import Modal from "react-bootstrap/Modal";
import MyCard from "../../components/UI/MyCard/MyCard";
import Card from "react-bootstrap/Card";
import classes from "./Register.module.css";


const Register = () => {
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const { registerUser } = useContext(AuthContext);
  const [modalShow, setModalShow] = useState(false);
  // const [modalEditShow, setmodalEditShow] = useState(false);
  const handleRegisterSubmit = async () => {
    registerUser(state.username, state.email, state.password, state.password2);
    setModalShow(true);

  };

  const closeModal = () => {
    setModalShow(false);
    navigate("/");
  }

  const inputChangeHandler = (inputValue) => {
    const { name, value } = inputValue;
    setState({ ...state, [name]: value });
  };

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const navigate = useNavigate();

  return (
    <section>
      <MyModal show={modalShow} onHide={() => closeModal()}>
        <Modal.Header closeButton className="center-block">
          <h2>Confirm registration</h2>
        </Modal.Header>
        <Modal.Body>
          <div className="center-block">
            <p>We have sent you an email to confirm your registration.</p>
          </div>
        </Modal.Body>
      </MyModal>
      <div className={`${classes.reregistration_form}`}>
      <Form onSubmit={handleSubmit(handleRegisterSubmit)}>
          <MyCard>
            <Card.Header className="card-header-text">Sign up </Card.Header>
            <Card.Body>
              <MyFormGroupInput
                label="Username"
                name="username"
                errors={errors}
                register={register}
                validationSchema={{
                  required: "⚠ This input is required.",
                }}
                onChange={inputChangeHandler}
              ></MyFormGroupInput>
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
              <MyFormGroupInput
                label="Repeat password"
                type="password"
                name="password2"
                errors={errors}
                register={register}
                validationSchema={{
                  required: "⚠ This input is required.",
                  validate: (value) => {
                    const { password } = getValues();
                    return password === value || "⚠ Passwords should match!";
                  },
                }}
                onChange={inputChangeHandler}
              ></MyFormGroupInput>
            </Card.Body>
          </MyCard>
        <div className='mt-3'>
          <MyButton additionalCl={"btn-md"} type="submit">
            Sign up
          </MyButton>
        </div>
      </Form>
      </div>
    </section>
  );
};

export default Register;
