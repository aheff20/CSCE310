import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Container, Table, Spinner, Row, Col, Card, Modal } from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";

function Profile(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  
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
            setUIN(res.data.uin);
            setEmail(res.data.email);
            setUsername(res.data.username);
            setPassword(res.data.pass);
            setDiscord(res.data.discord);
            setfName(res.data.first_name);
            setlName(res.data.last_name);
            setMInitial(res.data.m_initial);
            setLoading(false);
        })

  }, []);

  const handleShowAccountInfo = () => {
    setShowAccountInfo(true);
  }

  const handleCloseAccountInfo = () => {
    setShowAccountInfo(false);
  }

  const handleSaveAccountInfo = () => {
    axios
        .post("/users/updateUserInfo", {
            params: {
                userType: props.auth.user.user_type,
                uin: props.auth.user.uin,
                updatedFName: fname,
                updatedLName: lname,
                updatedMInitial: m_initial,
                updatedEmail: email,
                updatedDiscord: discord,
                updatedUsername: username
            }
        })
        .then((res) => {
            if(res.status === 201) {
                console.log(res.data);
                setError(res.data);
            } else {
                history.go(0);
                setShowAccountInfo(false);
            }
        })
  }


  const handleShowStudentInfo = () => {

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
                    <Col sm={3}>
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
                    <Col sm={3}>
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
                    <Col sm={3}>
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
                    <Col sm={3}>
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
                    <Col sm={3}>
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
                    <Col sm={3}>
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
                    <Col sm={3}>
                        <b>Username: </b>
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
                                        {userData.dob}
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
                                        {userData.minor1}
                                    </Col>
                                </Row>          
                                <Row>
                                    <Col style={{textAlign: "right"}}>
                                        <b>Minor 2: </b>
                                    </Col>    
                                    <Col>
                                        {userData.minor2}
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

                

                
            </React.Fragment>
        )}
        </Container>
        </div>
      
  );
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Profile);
