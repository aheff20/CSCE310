import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Container, Table, Spinner, Row, Col } from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";

function Programs(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    setLoading(false);
    

  }, []);  

  return (
    <div className="Events">
      <Container>
        {loading ? (
            <center>
                {" "}
                <Spinner animation="border" />{" "}
            </center>
        ):(
            <React.Fragment>
                <br></br>
                Welcome to programs page bub.

            </React.Fragment>
        )}
        </Container>
        </div>
      
  );
}

Programs.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Programs);
