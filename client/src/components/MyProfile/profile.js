import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Form, Button, Container, Table, Spinner, Row, Col, Card, Modal } from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";
import jwt_decode from "jwt-decode";
import setAuthToken from "../../utils/setAuthToken";

function Profile(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [showStudentInfo, setShowStudentInfo] = useState(false);
  
  const [error, setError] = useState({});

  const [fname, setfName] = useState("");
  const [lname, setlName] = useState("");
  const [m_initial, setMInitial] = useState("");
  const [discord, setDiscord] = useState("");
  const [uin, setUIN] = useState();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [gender, setGender] = useState("");
  const [hispaniclatino, setHispanicLatino] = useState("");
  const [race, setRace] = useState("");
  const [citizen, setCitizen] = useState("");
  const [firstGen, setFirstGen] = useState("");
  const [dob, setDOB] = useState("");
  const [gpa, setGPA] = useState();
  const [major, setMajor] = useState("");
  const [minor1, setMinor1] = useState("");
  const [minor2, setMinor2] = useState("");
  const [gradYear, setGradYear] = useState();
  const [school, setSchool] = useState("");
  const [classification, setClassification] = useState("");
  const [studentType, setStudentType] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    axios
        .get("/users/getUserData", {
            params: {
                uin: props.auth.user.uin,
                userType: props.auth.user.user_type,
            }
        })
        .then((res) => {
            setUserData(res.data);
            setLoading(false);
        })

  }, []);

  const maintainRecency = () => {
    setUIN(userData.uin);
    setEmail(userData.email);
    setUsername(userData.username);
    setDiscord(userData.discord);
    setfName(userData.first_name);
    setlName(userData.last_name);
    setMInitial(userData.m_initial);

    if(props.auth.user.user_type == "Student")  {
        setGender(userData.gender);
        setHispanicLatino(userData.hispanic_latino ? "Yes" : "No");
        setRace(userData.race);
        setCitizen(userData.citizen ? "Yes" : "No");
        setFirstGen(userData.first_gen ? "Yes" : "No");
        setDOB(userData.dob.substring(0, 10));
        setGPA(userData.gpa);
        setMajor(userData.major);
        setMinor1(userData.minor_1);
        setMinor2(userData.minor_2);
        setGradYear(userData.expected_graduation);
        setSchool(userData.school);
        setClassification(userData.classification);
        setStudentType(userData.student_type);
        setPhone(userData.phone);
    }
    
  }

  const handleShowAccountInfo = () => {
    maintainRecency();
    setShowAccountInfo(true);
    setShowStudentInfo(false);
  }

  const handleShowStudentInfo = () => {
    maintainRecency();
    setShowStudentInfo(true);
    setShowAccountInfo(true);
  }

  const handleCloseAccountInfo = () => {
    setShowAccountInfo(false);
    setShowStudentInfo(false);
  }

  const handleSaveAccountInfo = () => {
    let updateParams = {};

    updateParams["userType"] = props.auth.user.user_type;
    updateParams["uin"] = props.auth.user.uin;
    updateParams["updatedFName"] = fname;
    updateParams["updatedLName"] = lname;
    updateParams["updatedMInitial"] = m_initial;
    updateParams["updatedEmail"] = email;
    updateParams["updatedDiscord"] = discord;
    updateParams["updatedUsername"] = username;

    if(password != "") {
        updateParams["updatedPassword"] = password;
        updateParams["updatedPassword2"] = password2;
    }

    if(props.auth.user.user_type == "Student") {
        updateParams["updatedGender"] = gender,
        updateParams["updatedHispanicLatino"] = hispaniclatino,
        updateParams["updatedRace"] = race,
        updateParams["updatedCitizen"] = citizen,
        updateParams["updatedFirstGen"] = firstGen,
        updateParams["updatedDOB"] = dob,
        updateParams["updatedGPA"] = gpa,
        updateParams["updatedMajor"] = major,
        updateParams["updatedMinor1"] = minor1,
        updateParams["updatedMinor2"] = minor2,
        updateParams["updatedGraduation"] = gradYear,
        updateParams["updatedSchool"] = school,
        updateParams["updatedClassification"] = classification,
        updateParams["updatedStudentType"] = studentType,
        updateParams["updatedPhone"] = phone
    }

    axios
        .post("/users/updateUserInfo", updateParams)
        .then((res) => {
            if(res.status === 201) {
                console.log(res.data)
                setError(res.data);
            } else {
                
                const { token } = res.data;
                localStorage.setItem("jwtToken", token);
                setAuthToken(token);

                history.go(0);
                setShowAccountInfo(false);
                setShowStudentInfo(false);
            }
        })
  }


  const deactivateAccount = () => {
    let confirm = window.confirm("Are you sure you want to deactivate your account?");
    if(!confirm) {
        return;
    }
    axios
        .post("/users/deactivateUser", {uin: props.auth.user.uin})
        .then((res) => {
            props.logoutUser();
            history.push("/");
        })
  }

  return (
    <div className="Profile">
        <Modal show={showAccountInfo} onHide={handleCloseAccountInfo}>
            <Modal.Header closeButton>
            <Modal.Title>
                Editing Account Information
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm={4}>
                        <b>UIN: </b>
                    </Col>
                    <Col>
                    <Form.Control
                        readOnly
                        value={uin}
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
                            onChange={(e) => setfName(e.target.value)}
                            required
                            value={fname}
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
                        onChange={(e) => setlName(e.target.value)}
                        required
                        isInvalid={error.last_name}
                        value={lname}
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
                            onChange={(e) => setMInitial(e.target.value)}
                            required
                            isInvalid={error.m_initial}
                            value={m_initial}
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
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            value={email}
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
                            onChange={(e) => setDiscord(e.target.value)}
                            required
                            value={discord}
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
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        value={username}
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

                <hr></hr>
                <Modal.Title>
                    Change Password
                </Modal.Title>
                <br></br>

                <Row>
                    <Col sm={4}>
                        <b>New Password:</b>
                    </Col>
                    <Col>
                    <Form.Group>
                        <Form.Control
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        value={password}
                        id="password"
                        isInvalid={error.registerPassword}
                        type="password"
                        />
                        <Form.Control.Feedback type="invalid">
                            {error.registerPassword}
                        </Form.Control.Feedback>
                    </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col sm={4}>
                        <b>Confirm Password:</b>
                    </Col>
                    <Col>
                    <Form.Group>
                        <Form.Control
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                        value={password2}
                        id="password2"
                        isInvalid={error.registerPassword2}
                        type="password"
                        />
                        <Form.Control.Feedback type="invalid">
                            {error.registerPassword2}
                        </Form.Control.Feedback>
                    </Form.Group>
                    </Col>
                </Row>

                {showStudentInfo && 
                    <React.Fragment>
                        <Row>
                            <Col sm={4}>
                                <b>Gender:</b>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
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
                        </Row>

                        <Row>
                            <Col sm={4}>
                                <b>Hispanic/Latino:</b>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3">
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
                        </Row>

                        <Row>
                            <Col sm={4}>
                                <b>Race:</b>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3">
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
                        </Row>

                        <Row>
                            <Col sm={4}>
                                <b>US Citizen:</b>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3">
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
                        </Row>

                        <Row>
                            <Col sm={4}>
                                <b>First Gen Student:</b>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3">
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
                            <Col sm={4}>
                                <b>Date of Birth:</b>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3">
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
                            <Col sm={4}>
                                <b>GPA:</b>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3">
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
                            <Col sm={4}>
                                <b>Major:</b>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3">
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
                        </Row>

                        <Row>
                            <Col sm={4}>
                                <b>Minor 1:</b>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3">
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
                        </Row>

                        <Row>
                            <Col sm={4}>
                                <b>Minor 2:</b>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3">
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
                            <Col sm={4}>
                                <b>Exp. Grad Year:</b>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3">
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
                        </Row>

                        <Row>
                            <Col sm={4}>
                                <b>School:</b>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3">
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
                        </Row>

                        <Row>
                            <Col sm={4}>
                                <b>Classification:</b>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3">
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
                        </Row>
                        
                        <Row>
                            <Col sm={4}>
                                <b>Student Type:</b>
                            </Col>
                            <Col>

                            <Form.Group className="mb-3">
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
                            <Col sm={4}>
                                <b>Phone:</b>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3">
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

            
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAccountInfo}>
                Close
            </Button>
            <Button variant="primary" onClick={handleSaveAccountInfo}>
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
        ):(
            <React.Fragment>
                <br></br>
                <h2 className="display-5 text-center">My Profile</h2>
                <Row>
                    <Col>
                        <Card
                        border={"secondary"}
                        style={{ borderWidth: "5px"}}
                        className="p-3 m-4 rounded shadow"
                        >
                        <Card.Body>
                            <Card.Title className="display-6 text-center">
                                Account Information
                            </Card.Title>
                            <Row>
                                <Col style={{textAlign: "right"}}>
                                    <b>UIN:</b>
                                </Col>
                                <Col>
                                    {userData.uin}
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{textAlign: "right"}}>
                                    <b>First Name: </b>
                                </Col>    
                                <Col>
                                    {userData.first_name}
                                </Col>
                            </Row>     
                            <Row>
                                <Col style={{textAlign: "right"}}>
                                    <b>Last Name:</b>
                                </Col>    
                                <Col>
                                    {userData.last_name}
                                </Col>
                            </Row>         
                            <Row>
                                <Col style={{textAlign: "right"}}>
                                    <b>M Initial: </b>
                                </Col>    
                                <Col>
                                    {userData.m_initial}
                                </Col>
                            </Row>    
                            <Row>
                                <Col style={{textAlign: "right"}}>
                                    <b>Email</b>
                                </Col>    
                                <Col>
                                    {userData.email}
                                </Col>
                            </Row>         
                            <Row>
                                <Col style={{textAlign: "right"}}>
                                    <b>Discord:</b>
                                </Col>    
                                <Col>
                                    {userData.discord}
                                </Col>
                            </Row>     
                            <Row>
                                <Col style={{textAlign: "right"}}>
                                    <b>User Name:</b>
                                </Col>    
                                <Col>
                                    {userData.username}
                                </Col>
                            </Row>  
                            <center>
                                <br></br>
                                <Button variant="primary" type="submit" onClick={() => handleShowAccountInfo()}>
                                    Edit Account Information
                                </Button>  
                            </center>
                        </Card.Body>
                        </Card>
                    </Col>

                    {props.auth.user.user_type === "Student" &&
                        <Col>
                            <Card
                            border={"secondary"}
                            style={{ borderWidth: "5px"}}
                            className="p-3 m-4 rounded shadow"
                            >
                            <Card.Body>
                                <Card.Title className="display-6 text-center">
                                Student Information
                                </Card.Title>
                                <Row>
                                    <Col style={{textAlign: "right"}}>
                                        <b>Gender:</b>
                                    </Col>
                                    <Col>
                                        {userData.gender}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{textAlign: "right"}}>
                                        <b>Hispanic/Latino:</b>
                                    </Col>    
                                    <Col>
                                        {userData.hispanic_latino ? "Yes" : "No"}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{textAlign: "right"}}>
                                        <b>Race:</b>
                                    </Col>    
                                    <Col>
                                        {userData.race}
                                    </Col>
                                </Row>     
                                <Row>
                                    <Col style={{textAlign: "right"}}>
                                        <b>US Citizen </b>
                                    </Col>    
                                    <Col>
                                        {userData.citizen ? "Yes" : "No"}
                                    </Col>
                                </Row>  
                                <Row>
                                    <Col style={{textAlign: "right"}}>
                                        <b>First Gen Student:</b>
                                    </Col>    
                                    <Col>
                                        {userData.firstGen ? "Yes" : "No"}
                                    </Col>
                                </Row>            
                                <Row>
                                    <Col style={{textAlign: "right"}}>
                                        <b>Date of Birth:</b>
                                    </Col>    
                                    <Col>
                                        {userData.dob.substring(0,10)}
                                    </Col>
                                </Row>          
                                <Row>
                                    <Col style={{textAlign: "right"}}>
                                        <b>GPA: </b>
                                    </Col>    
                                    <Col>
                                        {userData.gpa}
                                    </Col>
                                </Row>     
                                <Row>
                                    <Col style={{textAlign: "right"}}>
                                        <b>Major:</b>
                                    </Col>    
                                    <Col>
                                        {userData.major}
                                    </Col>
                                </Row>                
                                <Row>
                                    <Col style={{textAlign: "right"}}>
                                        <b>Minor 1:</b>
                                    </Col>    
                                    <Col>
                                        {userData.minor_1}
                                    </Col>
                                </Row>          
                                <Row>
                                    <Col style={{textAlign: "right"}}>
                                        <b>Minor 2: </b>
                                    </Col>    
                                    <Col>
                                        {userData.minor_2}
                                    </Col>
                                </Row>         
                                <Row>
                                    <Col style={{textAlign: "right"}}>
                                        <b>Expected Graduation Year: </b>
                                    </Col>    
                                    <Col>
                                        {userData.expected_graduation}
                                    </Col>
                                </Row>         
                                <Row>
                                    <Col style={{textAlign: "right"}}>
                                        <b>School:  </b>
                                    </Col>   
                                    <Col>
                                        {userData.school}
                                    </Col>
                                </Row>       
                                <Row>
                                    <Col style={{textAlign: "right"}}>
                                        <b>Classification: </b>
                                    </Col>    
                                    <Col>
                                        {userData.classification}
                                    </Col>
                                </Row>       
                                <Row>
                                    <Col style={{textAlign: "right"}}>
                                        <b>Student Type: </b>
                                    </Col>    
                                    <Col>
                                        {userData.student_type}
                                    </Col>
                                    <Row>
                                        <Col style={{textAlign: "right"}}>
                                            <b>Phone Number: </b>
                                        </Col>    
                                        <Col>
                                            {userData.phone}
                                        </Col>
                                    </Row>       
                                </Row>  

                                <center>
                                    <br></br>
                                    <Button variant="primary" type="submit" onClick={() => handleShowStudentInfo()}>
                                        Edit Student Information
                                    </Button>  
                                </center>
                            </Card.Body>
                            </Card>
                        </Col>
                    
                    }

                </Row>
                <center>
                    <br></br>
                    <Button variant="danger btn-lg" onClick={() => deactivateAccount()}>
                        Deactivate Account
                    </Button>
                </center>
                <br></br><br></br>
                

                
            </React.Fragment>
        )}
        </Container>
        </div>
      
  );
}

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(Profile);
