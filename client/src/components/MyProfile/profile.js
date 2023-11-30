import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Container, Table, Spinner, Row, Col, Card } from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";

function Profile(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    console.log(props.auth.user)
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

  console.log(userData);

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
