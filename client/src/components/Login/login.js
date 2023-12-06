/**
 * View created and implemented by:
 *     Aidan Heffron
 */

import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import { Form, Button, Container } from "react-bootstrap";
import classnames from "classnames";

/**
 * A Login page for users to enter login information and be signed into the website via JSON Web Tokens 
 */
function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const history = useHistory();

  /**
   * State function to determine if a user is currently authenticated, sends them to the landing page if they are.
   */
  useEffect(() => {
    // console.log(props.auth);
    if (props.auth.isAuthenticated) {
      history.push("/");
    }
  }, [history, props.auth, props.auth.isAuthenticated]);

  /**
   * State function to load any errors from erroneous login information
   */
  useEffect(() => {
    // console.log(props.errors);
    setError(props.errors);
  }, [props.errors]);


  /**
   * Function to dispatch login information to backend to determine if a user can actually sign into the website
   */
  const onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      username: username,
      password: password,
    };
    props.loginUser(userData);
    
  };

  /**
   * Return React HTML for the login page. Creates a form that asks for username and password
   */
  return (
    <div className="Login">
      <Container>
        <h2 className="display-2 text-center">Login</h2>
        <Form noValidate onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Username</b>
            </Form.Label>
            <Form.Control
              type="username"
              required
              id="username"
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              tabIndex={1}
              isInvalid={error.invalidLogin}
              className={classnames("", {
                invalid: error.invalidLogin,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {error.invalidLogin}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Password</b>
            </Form.Label>
            <Form.Control
              type="password"
              required
              id="password"
              autoComplete="true"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              tabIndex={2}
              isInvalid={error.invalidLogin}
              className={classnames("", {
                invalid: error.invalidLogin
              })}
            />
            <Form.Control.Feedback type="invalid">
              {error.invalidLogin}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
        <div className="text-center">
          <p className="fs-5">
            Don't have an account? <Link to="/register">Register here!</Link>
          </p>
        </div>
      </Container>
    </div>
  );
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Login);
