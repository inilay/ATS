import React, { useContext } from "react";
import { AuthContext } from "../../context";
import MyButton from "../../components/UI/MyButton/MyButton";
import "../../styles/App.css";
import MLStageIcon from "../../assets/svg/MLStageIcon";
import ExpImageIcon from "../../assets/svg/ExpImageIcon";
import TimeManagmentIcon from "../../assets/svg/TimeManagmentIcon";
import SEIcon from "../../assets/svg/SEIcon";
import RRIcon from "../../assets/svg/RRIcon";
import DEIcon from "../../assets/svg/DEIcon";
import SWIcon from "../../assets/svg/SWIcon";
import { Link } from "react-router-dom";

const Home = () => {
    const { user, logoutUser } = useContext(AuthContext);

    return (
        <section className="">
            <div className="container-fluid home-div">
                <div className="row ">
                    <div className="col-lg-2"></div>
                    <div className="col-lg-8 col-md-12">
                        <div className="row">
                            <div className="col position-absolute top-50 start-0 translate-middle-y">
                                <Link to="/create_tournament" className="main-link">
                                    <p>Create Tournament</p>
                                </Link>
                                <Link to="/create_bracket" className="main-link">
                                    <p>Try Bracket Generator</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2"></div>
                </div>
            </div>
            <div className="container text-center mb-5">
                <h2 className="mb-5 pt-5">Enjoy your game, we'll handle the rest</h2>
                <div className="row pb-5">
                    <div className="col-lg-4 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Unique bracket constructor</h5>
                                <MLStageIcon />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Private Tournament</h5>
                                <ExpImageIcon />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Notification system</h5>
                                <TimeManagmentIcon />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container text-center">
                <h2 className="mb-5">Support various types of tournaments</h2>
                <div className="row pb-5">
                    <div className="col"></div>
                    <div className="col-lg-3 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Single Elimination</h5>
                                <SEIcon />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Round Robin</h5>
                                <RRIcon />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Double Elimination</h5>
                                <DEIcon />
                            </div>
                        </div>
                    </div>
                    <div className="col"></div>
                </div>
            </div>
            <div className="container text-center mb-5">
                <div className="row pb-5">
                    <div className="col"></div>
                    <div className="col-lg-3 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Swiss</h5>
                                <SWIcon />
                            </div>
                        </div>
                    </div>
                    <div className="col"></div>
                </div>
            </div>

            {!user && (
                <div className="container text-center my-5">
                    <h2>Providing the right tools for the gaming community</h2>
                    <p>We aim to keep things simple, but there's plenty more to explore in your website.</p>
                    <MyButton className="btn pb-5">
                        <a className="sign-button" href="/register">
                            Sign up
                        </a>
                    </MyButton>
                </div>
            )}
        </section>
    );
};

export default Home;
