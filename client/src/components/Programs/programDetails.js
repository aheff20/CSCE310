import { useState, useEffect } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Container, Table, Spinner, Row, Col, CardGroup } from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";
import ProgramCard from './programCard';

function ProgramDetails(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [allUserData, setAllUserData] = useState([]);
  const [programInfo, setProgramInfo] = useState({});

  const programNum = useParams().programNum;


  useEffect(() => {
    axios.get("/programs/getProgramInfo", {
        params: {
            programNum: programNum
        }})
        .then((res) => {
            setProgramInfo(res.data);
        })
    

    

    setLoading(false);
    
  }, []);

  return (
    <div className="Programs">
      <Container>
        {loading ? (
          <center>
            {" "}
            <Spinner animation="border" />{" "}
          </center>
        ) : (
          <React.Fragment>
            <br></br>
            <h2 className="display-5 text-center">Program {programNum} Details</h2>

            {props.auth.user.user_type == "Admin" ? (
                // Return a table with all students information who are in this program (programNum)
                // Each row in the table should be able to view more details in a modal to see more details/edit students
                <></>

            ) : (
                // If the user is a student, they should have buttons to add new certifiates/classes/internships to the program
                // Allow the user to see their progress in the program
                <></>


            )}

          </React.Fragment>
        )}
      </Container>
    </div>

  );
}

ProgramDetails.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ProgramDetails);
