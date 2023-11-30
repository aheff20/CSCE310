import { useState, useEffect } from "react";
import { useHistory, Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createUser } from "../../actions/authActions";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import classnames from "classnames";
import React from "react";


function CreateAccount(props) {
  const [loading, setLoading] = useState(true);
  const [fname, setfName] = useState("");
  const [lname, setlName] = useState("");
  const [m_initial, setMInitial] = useState("");
  const [discord, setDiscord] = useState("");
  const [uin, setUIN] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [gender, setGender] = useState("Choose Gender");
  const [hispaniclatino, setHispanicLatino] = useState("Select Option");
  const [race, setRace] = useState("Select Race");
  const [citizen, setCitizen] = useState("Select Option");
  const [firstGen, setFirstGen] = useState("Select Option");
  const [dob, setDOB] = useState("");
  const [gpa, setGPA] = useState();
  const [major, setMajor] = useState("");
  const [minor1, setMinor1] = useState("");
  const [minor2, setMinor2] = useState("");
  const [gradYear, setGradYear] = useState();
  const [school, setSchool] = useState("");
  const [classification, setClassification] = useState("Select Classification");
  const [studentType, setStudentType] = useState("Select Type");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState({});
  const [userType, setUserType] = useState("");

  const history = useHistory();

  useEffect(() => {
    if(history.location.state.type){
      setUserType(history.location.state.type);
      setLoading(false);
    }
    

  }, []);

  useEffect(() => {
    setError(props.errors);
  }, [props.errors]);

  const onSubmit = (e) => {
    e.preventDefault();
    if(userType === "Admin"){
      const newUser = {
        first_name: fname,
        last_name: lname,
        m_initial: m_initial, 
        email: email,
        username: username,
        password: password,
        password2: password2,
        discord: discord,
        uin: uin,
        userType: userType
      };
      props.createUser(newUser, history);

    } else {
      const newUser = {
        first_name: fname,
        last_name: lname,
        m_initial: m_initial, 
        email: email,
        username: username,
        password: password,
        password2: password2,
        discord: discord,
        uin: uin,
        userType: userType,
        gender: gender,
        hispanicLatino: hispaniclatino,
        race: race,
        citizen: citizen,
        firstGen: firstGen,
        dob: dob,
        gpa: gpa,
        major: major,
        minor1: minor1,
        minor2: minor2,
        graduation: gradYear,
        school: school,
        classification: classification,
        studentType: studentType,
        phone: phone
      };
      props.createUser(newUser, history);
    }
    
  };

  return (
    <div className="Register">
      <Container>
        <h2 className="display-2 text-center">Create {userType} Account</h2>
        <Form noValidate onSubmit={onSubmit}>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>
                  <b>First name</b>
                </Form.Label>
                <Form.Control
                  onChange={(e) => setfName(e.target.value)}
                  required
                  value={fname}
                  isInvalid={error.first_name}
                  id="fname"
                  type="text"
                  className={classnames("", {
                    invalid: error.first_name,
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {error.first_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>
                  <b>Middle Initial</b>
                </Form.Label>
                <Form.Control
                  onChange={(e) => setMInitial(e.target.value)}
                  required
                  value={m_initial}
                  isInvalid={error.m_initial}
                  id="m_initial"
                  type="text"
                  className={classnames("", {
                    invalid: error.m_initial,
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {error.m_initial}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>
                  <b>Last name</b>
                </Form.Label>
                <Form.Control
                  onChange={(e) => setlName(e.target.value)}
                  required
                  value={lname}
                  isInvalid={error.last_name}
                  id="lname"
                  type="text"
                  className={classnames("", {
                    invalid: error.last_name,
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {error.last_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>UIN</b>
            </Form.Label>
            <Form.Control
              onChange={(e) => setUIN(e.target.value)}
              value={uin}
              isInvalid={!!error.uin}
              id="uin"
              type="text"
              className={classnames("", {
                invalid: error.uin,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {error.uin}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Email Address</b>
            </Form.Label>
            <Form.Control
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              isInvalid={!!error.registerEmail}
              id="email"
              type="email"
              className={classnames("", {
                invalid: error.registerEmail,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {error.registerEmail}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Username</b>
            </Form.Label>
            <Form.Control
              onChange={(e) => setUsername(e.target.value)}
              required
              value={username}
              isInvalid={!!error.registerUsername}
              id="username"
              type="text"
              className={classnames("", {
                invalid: error.registerUsername,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {error.registerUsername}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Password</b>
            </Form.Label>
            <Form.Control
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              isInvalid={error.registerPassword}
              id="password"
              type="password"
              className={classnames("", {
                invalid: error.registerPassword,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {error.registerPassword}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Confirm Password</b>
            </Form.Label>
            <Form.Control
              onChange={(e) => setPassword2(e.target.value)}
              value={password2}
              isInvalid={error.registerPassword2}
              id="password2"
              type="password"
              className={classnames("", {
                invalid: error.registerPassword2,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {error.registerPassword2}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Discord</b>
            </Form.Label>
            <Form.Control
              onChange={(e) => setDiscord(e.target.value)}
              required
              value={discord}
              isInvalid={!!error.discord}
              id="discord"
              type="text"
              className={classnames("", {
                invalid: error.discord,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {error.discord}
            </Form.Control.Feedback>
          </Form.Group>

          {userType === "Student" &&
            <React.Fragment>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <b>Gender</b>
                    </Form.Label>
                    <Form.Select
                      aria-label="Gender"
                      value={gender}
                      isInvalid={!!error.gender}
                      onChange={(e) => {
                        if(e.target.value !== "Choose Gender"){
                          setGender(e.target.value);
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

                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <b>Hispanic/Latino?</b>
                    </Form.Label>
                    <Form.Select
                      aria-label="Hispanic/Latino"
                      value={hispaniclatino}
                      isInvalid={!!error.hispaniclatino}
                      onChange={(e) => {
                        if(e.target.value !== "Select Option"){
                          setHispanicLatino(e.target.value);
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

                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <b>Race</b>
                    </Form.Label>
                    <Form.Select
                      aria-label="Race"
                      value={race}
                      isInvalid={!!error.race}
                      onChange={(e) => {
                        if(e.target.value !== "Select Race"){
                          setRace(e.target.value);
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

                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <b>US Citizen?</b>
                    </Form.Label>
                    <Form.Select
                      aria-label="Citizen"
                      value={citizen}
                      isInvalid={!!error.citizen}
                      onChange={(e) => {
                        if(e.target.value !== "Select Option"){
                          setCitizen(e.target.value);
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

                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <b>First-Gen College Student?</b>
                    </Form.Label>
                    <Form.Select
                      aria-label="Citizen"
                      value={firstGen}
                      isInvalid={!!error.firstGen}
                      onChange={(e) => {
                        if(e.target.value !== "Select Option"){
                          setFirstGen(e.target.value);
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
                <Col sm={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <b>Date of Birth</b>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      aria-label="Dob"
                      value={dob}
                      isInvalid={!!error.dob}
                      onChange={(e) => {
                          setDOB(e.target.value);
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
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <b>Major</b>
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setMajor(e.target.value)}
                      required
                      value={major}
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
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <b>Minor 1</b>
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setMinor1(e.target.value)}
                      required
                      value={minor1}
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
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <b>Minor 2</b>
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setMinor2(e.target.value)}
                      required
                      value={minor2}
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
                <Col sm={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <b>GPA</b>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      aria-label="gpa"
                      placeholder="GPA"
                      value={gpa}
                      isInvalid={!!error.gpa}
                      onChange={(e) => {
                        if(e.target.value >= 0.0 && e.target.value <= 4.0) {
                          setGPA(e.target.value);
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
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <b>Expected Graduation Year</b>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      aria-label="grad"
                      placeholder="i.e. 2024"
                      value={gradYear}
                      isInvalid={!!error.graduation}
                      onChange={(e) => {
                        setGradYear(e.target.value);
                      }}
                      >
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {error.graduation}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <b>School</b>
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="i.e. Texas A&M University"
                      required
                      value={school}
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
                
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <b>Classification</b>
                    </Form.Label>
                    <Form.Select
                      aria-label="classification"
                      value={classification}
                      isInvalid={!!error.classification}
                      onChange={(e) => {
                        if(e.target.value !== "Select Classification"){
                          setClassification(e.target.value);
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

                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <b>Student Type</b>
                    </Form.Label>
                    <Form.Select
                      aria-label="studentType"
                      value={studentType}
                      isInvalid={!!error.studentType}
                      onChange={(e) => {
                        if(e.target.value !== "Select Type"){
                          setStudentType(e.target.value);
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
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <b>Phone Number</b>
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="i.e. (123)456-7890"
                      required
                      value={phone}
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

          <Button variant="primary" type="submit">
            Register Account
          </Button>
          <br></br><br></br><br></br>
        </Form>

        

        
      </Container>
    </div>
  );
}

CreateAccount.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { createUser })(withRouter(CreateAccount));
