import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Container, Navbar, Nav } from "react-bootstrap";
import logo from "./logo192.png";
import "./navbar.css";

function NavBar(props) {
    // State Management
    const [loggedIn, setLoggedIn] = useState(false);
    const [admin, setAdminNav] = useState(false);
    const [user, setUserNav] = useState(false);

    useEffect(() => {
        if (props.auth.isAuthenticated) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
            setAdminNav(false);
        }
        if (props.auth.user.user_type === "Admin") {
            setAdminNav(true);
            setUserNav(false);
        }
        if (props.auth.user.user_type === "Student") {
            setUserNav(true);
            setAdminNav(false);
        }

    }, [props.auth, props.auth.isAuthenticated]);

    const onLogoutClick = (e) => {
        e.preventDefault();
        props.logoutUser();
        setLoggedIn(false);
    };

    return (
        <div className="Navbar shadow-sm" >
            <Navbar style={{ "background-color": "#500000" }} collapseOnSelect expand="lg">
                <Container fluid>
                    <Navbar.Brand href="/">
                        <img
                            alt="logo"
                            src={logo}
                            width="auto"
                            height="30"
                            className="d-inline-block align-top mr-2"
                        />
                        TAMU CyberSecurity Club
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            {user &&
                                <React.Fragment>
                                    {loggedIn && <Nav.Link href="/programs">Programs</Nav.Link>}
                                    {loggedIn && <Nav.Link href="/events">Events</Nav.Link>}
                                </React.Fragment>
                            }
                            {admin &&
                                <React.Fragment>
                                    {loggedIn && <Nav.Link href="/programs">Programs</Nav.Link>}
                                    {loggedIn && <Nav.Link href="/events">Events</Nav.Link>}
                                    {loggedIn && <Nav.Link href="/management">Manage Users</Nav.Link>}
                                </React.Fragment>
                            }
                        </Nav>
                        <Nav>
                            {!loggedIn && <Nav.Link href="/login">Login</Nav.Link>}
                            {!loggedIn && <Nav.Link href="/register">Register</Nav.Link>}
                            {loggedIn && <Nav.Link href="/myprofile">Profile</Nav.Link>}
                            {loggedIn && <Nav.Link onClick={onLogoutClick}>Logout</Nav.Link>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

NavBar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(NavBar);
