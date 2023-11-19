import { Container, Button, Nav, Spinner } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import { loginUser } from "../../actions/authActions";
import axios from "axios";

function Landing(props) {

  const [isLoading2, setLoading2] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (props.auth.isAuthenticated) {
      setLoggedIn(true);
      setLoading2(false);
     
    } else {
      setLoggedIn(false);
    }
  }, [props.auth, props.auth.isAuthenticated]);

  const springProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 100,
  });

  return (
    <div className="Landing">
      <Container>
        {!loggedIn ? (
          <React.Fragment>
            <br></br><br></br><br></br>
            <h2 className="display-8 text-center">
              Please <a href="/login">Log In</a> or <a href="/register">Register</a>!
            </h2>
            <br></br><br></br>
          </React.Fragment>
        ): (
          <React.Fragment>
            {isLoading2 ? (
              <div className="d-flex justify-content-center">
                <Spinner animation="border" />
              </div>
            ):(
              <React.Fragment>
                <br></br><br></br><br></br>
                  <h2 className="display-3 text-center">
                    Welcome to TAMU CyberSecurity Club {props.auth.user.first_name}!
                  </h2>
              </React.Fragment>
            )}
          
          </React.Fragment>
        )}
        
      </Container>
    </div>
  );
}

Landing.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Landing);
