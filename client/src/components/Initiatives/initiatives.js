import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Container, Table, Spinner, Row, Col, Card, Modal } from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";
import jwt_decode from "jwt-decode";
import setAuthToken from "../../utils/setAuthToken";


function Initiatives(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);

  }, []);


  return (
    <div className="Profile">

      <Container>
        {loading ? (
            <center>
                {" "}
                <Spinner animation="border" />{" "}
            </center>
        ):(
            <React.Fragment>
                <br></br>
                <h2 className="display-5 text-center">My Initiatives</h2>
            
                
            </React.Fragment>
        )}
        </Container>
        </div>
      
  );
}

Initiatives.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Initiatives);
