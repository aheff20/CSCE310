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
  const [allUserData, setAllUserData] = useState([]);
  const [allProgramData, setAllProgramData] = useState([]);
  const [currentProgramName, setCurrentProgramName] = useState([]);
  const [currentProgramDescription, setCurrentProgramDescription] = useState([]);
  const [show, setShow] = useState(false);


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
      .get("/programs/getProgramData", {
        params: {
          program_num: programNum
        }
      })
      .then((res) => {
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
            <Col sm={4}>
              <b>User Type: </b>
            </Col>
            <Col>
              <Form.Select
                aria-label="User Type"
                value={currentUserType}
                onChange={(e) => { setCurrentUserType(e.target.value); }}
              >
                <option>Admin</option>
                <option>Student</option>
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <b>UIN: </b>
            </Col>
            <Col>
              <Form.Control
                readOnly
                value={currentUserUIN}
                id="uin"
                type="text"
              />
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <b>First Name: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => setCurrentUserFName(e.target.value)}
                  required
                  value={currentUserFName}
                  id="fname"
                  type="text"
                  isInvalid={error.first_name}
                />
                <Form.Control.Feedback type="invalid">
                  {error.first_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

          </Row>
          <Row>
            <Col sm={4}>
              <b>Last Name: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => setCurrentUserLName(e.target.value)}
                  required
                  isInvalid={error.last_name}
                  value={currentUserLName}
                  id="lname"
                  type="text"
                />
                <Form.Control.Feedback type="invalid">
                  {error.last_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <b>M Initial: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => setCurrentUserMInitial(e.target.value)}
                  required
                  isInvalid={error.m_initial}
                  value={currentUserMInitial}
                  id="m_initial"
                  type="text"
                />
                <Form.Control.Feedback type="invalid">
                  {error.m_initial}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <b>Email: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => setCurrentUserEmail(e.target.value)}
                  required
                  value={currentUserEmail}
                  id="email"
                  isInvalid={error.registerEmail}
                  type="text"
                />
                <Form.Control.Feedback type="invalid">
                  {error.registerEmail}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <b>Discord: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => setCurrentUserDiscord(e.target.value)}
                  required
                  value={currentUserDiscord}
                  id="discord"
                  isInvalid={error.discord}
                  type="text"
                />
                <Form.Control.Feedback type="invalid">
                  {error.discord}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <b>Username:</b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => setCurrentUserUsername(e.target.value)}
                  required
                  value={currentUserUsername}
                  id="username"
                  isInvalid={error.registerUsername}
                  type="text"
                />
                <Form.Control.Feedback type="invalid">
                  {error.registerUsername}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {currentUserType == "Student" &&
            <React.Fragment>
              <Row>
                <Col sm={4}>
                  <b>Gender:</b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Select
                      aria-label="Gender"
                      value={currentUserGender}
                      isInvalid={!!error.gender}
                      onChange={(e) => {
                        if (e.target.value !== "Choose Gender") {
                          setCurrentUserGender(e.target.value);
                        }
                      }}
                    >
                      <option>Choose Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {error.gender}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <b>Hispanic/Latino:</b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Select
                      aria-label="Hispanic/Latino"
                      value={currentUserHispanicLatino}
                      isInvalid={!!error.hispaniclatino}
                      onChange={(e) => {
                        if (e.target.value !== "Select Option") {
                          setCurrentUserHispanicLatino(e.target.value);
                        }
                      }}
                    >
                      <option>Select Option</option>
                      <option>Yes</option>
                      <option>No</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {error.hispaniclatino}
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <b>Race:</b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Select
                      aria-label="Race"
                      value={currentUserRace}
                      isInvalid={!!error.race}
                      onChange={(e) => {
                        if (e.target.value !== "Select Race") {
                          setCurrentUserRace(e.target.value);
                        }
                      }}
                    >
                      <option>Select Race</option>
                      <option>American Indian or Alaskan Native</option>
                      <option>Asian</option>
                      <option>Black or African American</option>
                      <option>Native Hawaiian or Other Pacific Islander</option>
                      <option>White</option>

                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {error.race}
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <b>US Citizen:</b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Select
                      aria-label="Citizen"
                      value={currentUserCitizen}
                      isInvalid={!!error.citizen}
                      onChange={(e) => {
                        if (e.target.value !== "Select Option") {
                          setCurrentUserCitizen(e.target.value);
                        }
                      }}
                    >
                      <option>Select Option</option>
                      <option>Yes</option>
                      <option>No</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {error.citizen}
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <b>First Gen Student:</b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Select
                      aria-label="Citizen"
                      value={currentUserFirstGen}
                      isInvalid={!!error.firstGen}
                      onChange={(e) => {
                        if (e.target.value !== "Select Option") {
                          setCurrentUserFirstGen(e.target.value);
                        }
                      }}
                    >
                      <option>Select Option</option>
                      <option>Yes</option>
                      <option>No</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {error.firstGen}
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <b>Date of Birth:</b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="date"
                      aria-label="Dob"
                      value={currentUserDOB}
                      isInvalid={!!error.dob}
                      onChange={(e) => {
                        setCurrentUserDOB(e.target.value);
                      }}
                    >
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {error.dob}
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <b>GPA:</b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="number"
                      aria-label="gpa"
                      placeholder="GPA"
                      value={currentUserGPA}
                      isInvalid={!!error.gpa}
                      onChange={(e) => {
                        if (e.target.value >= 0.0 && e.target.value <= 4.0) {
                          setCurrentUserGPA(e.target.value);
                        }
                      }}
                    >
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {error.gpa}
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <b>Major:</b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Control
                      onChange={(e) => setCurrentUserMajor(e.target.value)}
                      required
                      value={currentUserMajor}
                      isInvalid={!!error.major}
                      id="major"
                      type="text"
                      className={classnames("", {
                        invalid: error.major,
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {error.major}
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <b>Minor 1:</b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Control
                      onChange={(e) => setCurrentUserMinor1(e.target.value)}
                      required
                      value={currentUserMinor1}
                      isInvalid={!!error.minor1}
                      id="minor1"
                      type="text"
                      className={classnames("", {
                        invalid: error.minor1,
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {error.minor1}
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <b>Minor 2:</b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Control
                      onChange={(e) => setCurrentUserMinor2(e.target.value)}
                      required
                      value={currentUserMinor2}
                      isInvalid={!!error.minor2}
                      id="minor2"
                      type="text"
                      className={classnames("", {
                        invalid: error.minor2,
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {error.minor2}
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <b>Exp. Grad Year:</b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="number"
                      aria-label="grad"
                      placeholder="i.e. 2024"
                      value={currentUserGradYear}
                      isInvalid={!!error.graduation}
                      onChange={(e) => {
                        setCurrentUserGradYear(e.target.value);
                      }}
                    >
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {error.graduation}
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <b>School:</b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Control
                      onChange={(e) => setCurrentUserSchool(e.target.value)}
                      placeholder="i.e. Texas A&M University"
                      required
                      value={currentUserSchool}
                      isInvalid={!!error.school}
                      id="school"
                      type="text"
                      className={classnames("", {
                        invalid: error.school,
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {error.school}
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <b>Classification:</b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Select
                      aria-label="classification"
                      value={currentUserClassification}
                      isInvalid={!!error.classification}
                      onChange={(e) => {
                        if (e.target.value !== "Select Classification") {
                          setCurrentUserClassification(e.target.value);
                        }
                      }}
                    >
                      <option>Select Classification</option>
                      <option>Freshman</option>
                      <option>Sophomore</option>
                      <option>Junior</option>
                      <option>Senior</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {error.classification}
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <b>Student Type:</b>
                </Col>
                <Col>

                  <Form.Group className="mb-3">
                    <Form.Select
                      aria-label="studentType"
                      value={currentUserStudentType}
                      isInvalid={!!error.studentType}
                      onChange={(e) => {
                        if (e.target.value !== "Select Type") {
                          setCurrentUserStudentType(e.target.value);
                        }
                      }}
                    >
                      <option>Select Type</option>
                      <option>Part-time</option>
                      <option>Full-time</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {error.studentType}
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <b>Phone:</b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Control
                      onChange={(e) => setCurrentUserPhone(e.target.value)}
                      placeholder="i.e. (123)456-7890"
                      required
                      value={currentUserPhone}
                      isInvalid={!!error.phone}
                      id="phone"
                      type="text"
                      className={classnames("", {
                        invalid: error.phone,
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {error.phone}
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
              </Row>

            </React.Fragment>
          }

          <br></br>
          {currentUserType != "Deactivated" &&
            <Row>
              <Button variant="warning btn-lg" onClick={handleDeactivate}>
                Deactivate Account
              </Button>
            </Row>
          }
          <br></br>
          <Row>
            <Button variant="danger btn-lg" onClick={handleDelete}>
              Delete Account
            </Button>
          </Row>
          <br></br>

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
