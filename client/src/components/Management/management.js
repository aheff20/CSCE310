/**
View created and implemented by:
    Aidan Heffron

*/

import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Container, Table, Spinner, Row, Col, Modal} from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";


/**
    A management page for admins to view/edit/delete any user information on the website.

    * Can update user/admin types
    * Can edit any personal data for any user
    * Can Deactivate or Delete any accounts

*/
function Management(props) {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [allUserData, setAllUserData] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [error, setError] = useState({});
    
    const [show, setShow] = useState(false);
    const [currentUserUIN, setCurrentUserUIN] = useState();
    const [currentUserType, setCurrentUserType] = useState("");
    const [currentUserFName, setCurrentUserFName] = useState("");
    const [currentUserLName, setCurrentUserLName] = useState("");
    const [currentUserMInitial, setCurrentUserMInitial] = useState("");
    const [currentUserEmail, setCurrentUserEmail] = useState("");
    const [currentUserUsername, setCurrentUserUsername] = useState("");
    const [currentUserDiscord, setCurrentUserDiscord] = useState("");

    const [currentUserGender, setCurrentUserGender] = useState("");
    const [currentUserHispanicLatino, setCurrentUserHispanicLatino] = useState("");
    const [currentUserRace, setCurrentUserRace] = useState("");
    const [currentUserCitizen, setCurrentUserCitizen] = useState("");
    const [currentUserFirstGen, setCurrentUserFirstGen] = useState("");
    const [currentUserDOB, setCurrentUserDOB] = useState("");
    const [currentUserGPA, setCurrentUserGPA] = useState();
    const [currentUserMajor, setCurrentUserMajor] = useState("");
    const [currentUserMinor1, setCurrentUserMinor1] = useState("");
    const [currentUserMinor2, setCurrentUserMinor2] = useState("");
    const [currentUserGradYear, setCurrentUserGradYear] = useState();
    const [currentUserSchool, setCurrentUserSchool] = useState("");
    const [currentUserClassification, setCurrentUserClassification] = useState("");
    const [currentUserStudentType, setCurrentUserStudentType] = useState("");
    const [currentUserPhone, setCurrentUserPhone] = useState("");

    /**
        Grab information on all users to populate the table with
    */
    useEffect(() => {
        axios
            .get("/users/getAllUserData")
            .then((res) => {
                setTotalUsers(res.data.length);
                setAllUserData(res.data);
                setLoading(false);
            })
    }, []);

    /**
        Return row elements for the table so every student can be viewed and edited
    */
    const getTable = (tableKey) => {
        const list = [];
        for(let k = 0; k < allUserData.length; k++) {
            if(allUserData[k].user_type != tableKey) {
                continue;
            }

            const temp = <tr key={k}>
                            <td>{allUserData[k].uin}</td>
                            <td>{allUserData[k].first_name} {allUserData[k].m_initial}. {allUserData[k].last_name}</td>
                            <td>{allUserData[k].email}</td>
                            <td>{allUserData[k].username}</td>
                            <td>{allUserData[k].discord}</td>
                            <td>
                                <Button variant="success btn-sm" onClick={() => editAccount(allUserData[k].uin, allUserData[k].user_type)}>
                                    Edit
                                </Button>
                            </td>
                        </tr>
            list.push(temp);
        }
        return list;
    }

    /**
     * Function to create a new account, pushes admin to a new page where they can create the new account
     */
    const createAccount = (type) => {
        history.push("/createAccount", {type: type})
    }

    /**
     * Function to edit a user account, sets all state variables to the specific account information and opens a modal to edit it
     */
    const editAccount = (userUIN, userType) => {
        axios
            .get("/users/getUserData", {
                params: {
                    uin: userUIN,
                    userType: userType,
                }
            })
            .then((res) => {
                setCurrentUserUIN(userUIN);
                setCurrentUserType(userType);
                setCurrentUserFName(res.data.first_name);
                setCurrentUserLName(res.data.last_name);
                setCurrentUserMInitial(res.data.m_initial);
                setCurrentUserEmail(res.data.email);
                setCurrentUserUsername(res.data.username);
                setCurrentUserDiscord(res.data.discord);
                setCurrentUserGender(res.data.gender);
                setCurrentUserHispanicLatino(res.data.hispanic_latino ? "Yes" : "No");
                setCurrentUserRace(res.data.race);
                setCurrentUserCitizen(res.data.citizen ? "Yes" : "No");
                setCurrentUserFirstGen(res.data.first_gen ? "Yes" : "No");
                setCurrentUserDOB(res.data.dob ? res.data.dob.substring(0,10) : "");
                setCurrentUserGPA(res.data.gpa);
                setCurrentUserMajor(res.data.major);
                setCurrentUserMinor1(res.data.minor_1);
                setCurrentUserMinor2(res.data.minor_2);
                setCurrentUserGradYear(res.data.expected_graduation);
                setCurrentUserSchool(res.data.school);
                setCurrentUserClassification(res.data.classification);
                setCurrentUserStudentType(res.data.student_type);
                setCurrentUserPhone(res.data.phone);
                setShow(true);
            })        
    }

    /**
     * Reset all modal information and close modal
     */
    const handleClose = () => {
        setCurrentUserUIN();
        setCurrentUserType("");
        setCurrentUserFName("");
        setCurrentUserLName("");
        setCurrentUserMInitial("");
        setCurrentUserEmail("");
        setCurrentUserUsername("");
        setCurrentUserDiscord("");
        setCurrentUserGender("");
        setCurrentUserHispanicLatino("");
        setCurrentUserRace("");
        setCurrentUserCitizen("");
        setCurrentUserFirstGen("");
        setCurrentUserDOB("");
        setCurrentUserGPA();
        setCurrentUserMajor("");
        setCurrentUserMinor1("");
        setCurrentUserMinor2("");
        setCurrentUserGradYear();
        setCurrentUserSchool("");
        setCurrentUserClassification("");
        setCurrentUserStudentType("");
        setCurrentUserPhone("");
        setShow(false);
    }

    /**
     * Send updated user information to backend, refresh the page and close the modal
     */
    const handleSave = () => {
        let updateParams = {};

        updateParams["userType"] = currentUserType;
        updateParams["uin"] = currentUserUIN;
        updateParams["updatedFName"] = currentUserFName;
        updateParams["updatedLName"] = currentUserLName;
        updateParams["updatedMInitial"] = currentUserMInitial;
        updateParams["updatedEmail"] = currentUserEmail;
        updateParams["updatedDiscord"] = currentUserDiscord;
        updateParams["updatedUsername"] = currentUserUsername;

        if(currentUserType == "Student") {
            updateParams["updatedGender"] = currentUserGender,
            updateParams["updatedHispanicLatino"] = currentUserHispanicLatino,
            updateParams["updatedRace"] = currentUserRace,
            updateParams["updatedCitizen"] = currentUserCitizen,
            updateParams["updatedFirstGen"] = currentUserFirstGen,
            updateParams["updatedDOB"] = currentUserDOB,
            updateParams["updatedGPA"] = currentUserGPA,
            updateParams["updatedMajor"] = currentUserMajor,
            updateParams["updatedMinor1"] = currentUserMinor1,
            updateParams["updatedMinor2"] = currentUserMinor2,
            updateParams["updatedGraduation"] = currentUserGradYear,
            updateParams["updatedSchool"] = currentUserSchool,
            updateParams["updatedClassification"] = currentUserClassification,
            updateParams["updatedStudentType"] = currentUserStudentType,
            updateParams["updatedPhone"] = currentUserPhone
        }

        axios
            .post("/users/updateUserInfo", updateParams)
            .then((res) => {
                if(res.status === 201) {
                    console.log(res.data)
                    setError(res.data);
                } else {
                    history.go(0);
                    setShow(false);
                }
            })

    }
    
    /**
     * Function to deactivate a user account. Refresh page on complete
     */
    const handleDeactivate = () => {
        let confirm = window.confirm("Are you sure you want to deactivate " + currentUserFName + " " + currentUserLName + "'s account?");
        if(!confirm) {
            return;
        }
        axios
            .post("/users/deactivateUser", {uin: currentUserUIN})
            .then((res) => {
                history.go(0);
                setShow(false);
            })
    }

    /**
     * Function to delete a user account. Refresh page on complete
     */
    const handleDelete = () => {
        let confirm = window.confirm("Are you sure you want to deactivate " + currentUserFName + " " + currentUserLName + "'s account? This action CANNOT be undone.");
        if(!confirm) {
            return;
        }
        axios
            .post("/users/deleteUser", {uin: currentUserUIN})
            .then((res) => {
                history.go(0);
                setShow(false);
            })
    }


    /**
     * React html to return for the page view. Modal is called when set to show, the table is looped for each user and userType to be created efficiently.
     */
    return (
        <div className="Management">
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>
                    Editing: <i>{currentUserFName} {currentUserMInitial} {currentUserLName}</i>
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
                                        if(e.target.value !== "Choose Gender"){
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
                                    if(e.target.value !== "Select Option"){
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
                                    if(e.target.value !== "Select Race"){
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
                                    if(e.target.value !== "Select Option"){
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
                                    if(e.target.value !== "Select Option"){
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
                                    if(e.target.value >= 0.0 && e.target.value <= 4.0) {
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
                                    if(e.target.value !== "Select Classification"){
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
                                    if(e.target.value !== "Select Type"){
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
            ):(
                <React.Fragment>
                    <br></br>
                    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                        <Row>
                            <Col>
                                <Button variant="primary btn-lg" onClick={() => createAccount("Admin")}>
                                    Create Admin Account
                                </Button>
                            </Col>

                            <Col>
                                <Button variant="primary btn-lg" onClick={() => createAccount("Student")}>
                                    Create Student Account
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    <br></br>
                    {["Admin", "Student", "Deactivated"].map((tableKey) => {
                        return <React.Fragment>
                        <div className="Admin Table">
                            <h2 className="display-5 text-center">{tableKey} Accounts</h2>
                            <Table striped bordered hover className="text-center">
                                <thead>
                                    <tr>
                                        <th class="col-md-1">UIN</th>
                                        <th class="col-md-2">Name</th>
                                        <th class="col-md-2">Email</th>
                                        <th class="col-md-2">Username</th>
                                        <th class="col-md-2">Discord</th>
                                        <th class="col-md-1">Edit</th>
                                    </tr>
                                </thead>
                                <tbody>{getTable(tableKey)}</tbody>
                            </Table>
                            <br></br>
                        </div>
                        </React.Fragment>
                    })}

                </React.Fragment>
            )}
            </Container>
            </div>
        
    );
}

Management.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Management);
