import React, { Fragment, useContext } from "react";
import classes from "./MyNavbar.module.css";
import { AuthContext } from "../../../context";
import { Container, Nav, Navbar, Dropdown } from "react-bootstrap";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import SettingIcon from "../../../assets/svg/SettingIcon";
import HomeIcon from "../../../assets/svg/HomeIcon";
import MobileMenuIcon from "../../../assets/svg/MobileMenuIcon";
import { Link } from "react-router-dom";

const MyNavbar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    return (
        <Navbar className={`${classes.my_navbar} mb-3`} abg="dark" expand="lg">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">
                    <HomeIcon />
                </Navbar.Brand>
                <ThemeSwitcher additionalCl={`${classes.theme_swither_min}`} />
                <Navbar.Toggle className={`${classes.navbar_toggler}`} aria-controls="navbarScroll">
                    <MobileMenuIcon />
                </Navbar.Toggle>
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto  my-lg-0" navbarScroll>
                        <Link className={classes.nav_link} to="/tournaments">
                            <h5>Tournaments</h5>
                        </Link>
                        <Link className={classes.nav_link} to="/create_tournament">
                            <h5>Create Tournament</h5>
                        </Link>
                        {user && (
                            <Fragment>
                                <Link
                                    className={`${classes.nav_link} ${classes.inner_navbar_min}`}
                                    to={`/profile/${user.username}`}
                                >
                                    <h5>Profile</h5>
                                </Link>
                                <Link className={`${classes.nav_link} ${classes.inner_navbar_min}`} onClick={logoutUser}>
                                    <h5>Log out</h5>
                                </Link>
                            </Fragment>
                        )}
                    </Nav>
                    <ThemeSwitcher additionalCl={`${classes.theme_swither_max}`} />
                    {user ? (
                        <Nav className={`ml-auto`} navbar>
                            <Dropdown className={classes.inner_navbar_max}>
                                <Dropdown.Toggle drop="down" className={`${classes.my_toggle} ${"shadow-none"}`}>
                                    <SettingIcon />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className={classes.my_drop}>
                                    <Dropdown.Item
                                        className={classes.nav_item}
                                        as={Link}
                                        to={`/profile/${user.username}`}
                                    >
                                        Profile
                                    </Dropdown.Item>
                                    <Dropdown.Item className={classes.nav_item} as={Link} to="/" onClick={logoutUser}>
                                        Log out
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    ) : (
                        <Nav className="my-lg-0" navbarScroll>
                            <Link to="/login" className={classes.nav_link}>
                                <h5>Log in</h5>
                            </Link>
                            <Link to="/register" className={classes.nav_link}>
                                <h5>Sign up</h5>
                            </Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MyNavbar;
