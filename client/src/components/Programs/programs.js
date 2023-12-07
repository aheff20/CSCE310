import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Container, Table, Modal, Spinner, Row, Col, CardGroup } from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";
import ProgramCard from './programCard';

function Programs(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [allProgramData, setAllProgramData] = useState([]);
  const [currentProgramNum, setCurrentProgramNum] = useState([]);
  const [currentProgramName, setCurrentProgramName] = useState([]);
  const [currentProgramDescription, setCurrentProgramDescription] = useState([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState({});


  useEffect(() => {
    axios
      .get("/programs/getAllProgramData")
      .then((res) => {
        setAllProgramData(res.data);
        setLoading(false);
      });

  }, []);

  const handleCreateNewProgram = () => {
    console.log(`Creating new program`);
  }

  const handleEditProgram = (programNum) => {
    console.log(`Editing program ${programNum}`);
    axios
      .get("/programs/getProgramInfo", {
        params: {
          programNum: programNum
        }
      })
      .then((res) => {
        setCurrentProgramNum(programNum);
        setCurrentProgramName(res.data.program_name);
        setCurrentProgramDescription(res.data.program_description);
        setShow(true);
      })
  };

  const applyToProgram = (programNum) => {

  }

  const deleteProgramHandler = (programNum) => {

  }

  const programDetailsHandler = (programNum) => {
    history.push("/programs/" + programNum);

  }

  /**
     * Send updated user information to backend, refresh the page and close the modal
     */
  const handleSave = () => {
    let updateParams = {};

    updateParams["programNum"] = currentProgramNum;
    updateParams["updatedName"] = currentProgramName;
    updateParams["updatedDesc"] = currentProgramDescription;

    axios
      .post("/programs/updateProgramInfo", updateParams)
      .then((res) => {
        if (res.status === 201) {
          console.log(res.data)
          setError(res.data);
        } else {
          history.go(0);
          setShow(false);
        }
      })

  }

  /**
   * Reset all modal information and close modal
   */
  const handleClose = () => {
    // setCurrentUserUIN();
    // setCurrentUserType("");
    // setCurrentUserFName("");
    // setCurrentUserLName("");
    // setCurrentUserMInitial("");
    // setCurrentUserEmail("");
    // setCurrentUserUsername("");
    // setCurrentUserDiscord("");
    // setCurrentUserGender("");
    // setCurrentUserHispanicLatino("");
    // setCurrentUserRace("");
    // setCurrentUserCitizen("");
    // setCurrentUserFirstGen("");
    // setCurrentUserDOB("");
    // setCurrentUserGPA();
    // setCurrentUserMajor("");
    // setCurrentUserMinor1("");
    // setCurrentUserMinor2("");
    // setCurrentUserGradYear();
    // setCurrentUserSchool("");
    // setCurrentUserClassification("");
    // setCurrentUserStudentType("");
    // setCurrentUserPhone("");
    setShow(false);
  }

  const programsForUser = allProgramData.map((program) => (
    <ProgramCard
      key={program.program_num}
      isAdmin={props.auth.user.user_type === "Admin"}
      programData={program}
      editProgramHandler={() => handleEditProgram(program.program_num)}
      applyToProgram={() => applyToProgram(program.program_num)}
      deleteProgramHandler={() => deleteProgramHandler(program.program_num)}
      programDetailsHandler={() => programDetailsHandler(program.program_num)} />
  ))

  return (
    <div className="Programs">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Editing: <i>{currentProgramName}</i>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={6}>
              <b>Program Name: </b>
            </Col>
            <Col>
              <Form.Control
                onChange={(e) => setCurrentProgramName(e.target.value)}
                required
                value={currentProgramName}
                id="pname"
                type="text"
                isInvalid={error.program_name}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <b>Program Description: </b>
            </Col>
            <Col>
              <Form.Control
                onChange={(e) => setCurrentProgramDescription(e.target.value)}
                required
                value={currentProgramDescription}
                id="pdesc"
                type="textarea"
                isInvalid={error.program_description}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Container>
        {loading ? (
          <center>
            {" "}
            <Spinner animation="border" />{" "}
          </center>
        ) : (
          <React.Fragment>
            <br></br>
            <h2 className="display-5 text-center">Program Data</h2>
            {props.auth.user.user_type === "Admin" &&
              <center>
                <Button
                  variant="primary btn-lg"
                  type="submit"
                  onClick={() => handleCreateNewProgram()}>
                  Create New Program
                </Button>
              </center>
            }

            <br></br>
            <CardGroup>{programsForUser}</CardGroup>

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
