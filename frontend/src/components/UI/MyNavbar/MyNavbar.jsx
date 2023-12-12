import React, { useContext } from "react";
import classes from "./MyNavbar.module.css";
import { AuthContext } from "../../../context";
import { Container, Nav, Navbar, Dropdown } from "react-bootstrap";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import SettingIcon from "../../../assets/svg/SettingIcon";
import HomeIcon from "../../../assets/svg/HomeIcon";
import { Link } from 'react-router-dom';


const MyNavbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <Navbar className={`${classes.my_navbar} mb-3`} abg="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <HomeIcon />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll">
          <span className="navbar-toggler-bar navbar-kebab">~</span>
        </Navbar.Toggle>
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto  my-lg-0" navbarScroll>
            <Link className={classes.nav_link} to="/tournaments">
              <h5>Tournaments</h5>
            </Link>
            <Link className={classes.nav_link} to="/create_tournament">
              <h5>Create Tournament</h5>
            </Link>
          </Nav>

          <ThemeSwitcher></ThemeSwitcher>
          {user ? (
            <>
              <Nav className="ml-auto" navbar>
                <Dropdown>
                  <Dropdown.Toggle
                    drop="down"
                    className={`${classes.my_toggle} ${"shadow-none"}`}
                  >
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
                    <Dropdown.Item
                      className={classes.nav_item}
                      as={Link}
                      to="/"
                      onClick={logoutUser}
                    >
                      Log out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </>
          ) : (
            <>
              <Link to="/login" className={classes.nav_link}>
                <h6>Log in</h6>
              </Link>
              <Link to="/register" className={classes.nav_link}>
                <h6>Sign up</h6>
              </Link>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
