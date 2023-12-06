import { useState, useEffect } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Container, Table, Spinner, Row, Col, CardGroup, Modal } from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";
import ProgramCard from './programCard';

function ProgramDetails(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [allUserData, setAllUserData] = useState([]);
  /* uin, first_name, last_name, m_initial, email, discord, username, pass, user_type */
  const [programInfo, setProgramInfo] = useState({});
  /* program_description, program_name, program_num [can ignore] */
    
  // modal information (for admin view)
  const [show, setShow] = useState(false);
  const [currentUserType, setUserType] = useState("");
  const [uin, setUIN] = useState();
  const [fname, setfName] = useState("");
  const [lname, setlName] = useState("");
  const [m_initial, setMInitial] = useState("");
  const [email, setEmail] = useState("");
  const [discord, setDiscord] = useState("");
  const [username, setUsername] = useState("");
  // include student information
  const [showStudent, setShowStudent] = useState(false);
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
  // data metrics
  const [studentCount, setStudentCount] = useState(0);
  const [raceCounts, setRaceCounts] = useState({});
  const [hisplatCounts, setHispLatCounts] = useState(0);
  const [majorCounts, setmajorCounts] = useState({});


  const programNum = useParams().programNum;


  useEffect(() => {
    axios.get("/programs/getProgramInfo", {
        params: {
            programNum: programNum
        }})
        .then((res) => {
            //console.log(res.data)
            setProgramInfo(res.data);
            // get additional info only if admin
            if (props.auth.user.user_type == "Admin") {
              //console.log("getting users?")
              axios
                .get("/programs/getProgramUsers", {
                  params: {
                    programNum: programNum
                  }
                })
                .then((res) => {
                    //console.log(res)
                    setAllUserData(res.data);
                    getMetricData(res.data);
                    setLoading(false);
                })
            }
            else setLoading(false);
        })
  }, []);

  const getMetricData = (userData) => {
    let sc = userData.length;
    let rc = {};
    let hc = 0;
    let mc = {};
    for(let k = 0; k < sc; k++) {
      if (userData[k].hispanic_latino) hc++;
      let race = userData[k].race;
      let major = userData[k].major;
      if (race in rc) rc[race]++; else rc[race] = 1;
      if (major in mc) mc[major]++; else mc[major] = 1;
    }
    //console.log("results");
    //console.log(rc);
    //console.log(mc);

    setStudentCount(sc);
    setRaceCounts(rc);
    setHispLatCounts(hc);
    setmajorCounts(mc);
  }

  const studentHandler = (userUIN, userType) => {
    axios
      .get("/users/getUserData", {
        params: {
          uin: userUIN,
          userType: userType,
        }
      })
      .then((res) => {
        //console.log(res.data);
        setUserType(res.data.user_type);
        setUIN(res.data.uin);
        setfName(res.data.first_name);
        setlName(res.data.last_name);
        setMInitial(res.data.m_initial);
        setEmail(res.data.email);
        setDiscord(res.data.discord);
        setUsername(res.data.username);

        if(res.data.user_type === "Student") {
          setGender(res.data.gender);
          setHispanicLatino(res.data.hispanic_latino ? "Yes" : "No");
          setRace(res.data.race);
          setCitizen(res.data.citizen ? "Yes" : "No");
          setFirstGen(res.data.first_gen ? "Yes" : "No");
          setDOB(res.data.dob.substring(0, 10));
          setGPA(res.data.gpa);
          setMajor(res.data.major);
          setMinor1(res.data.minor_1);
          setMinor2(res.data.minor_2);
          setGradYear(res.data.expected_graduation);
          setSchool(res.data.school);
          setClassification(res.data.classification);
          setStudentType(res.data.student_type);
          setPhone(res.data.phone);
        }

        setShowStudent(false);
        
        if (props.auth.user.user_type == "Admin") {
          setShow(true);
        }
      })   
  }

  const handleClose = () => {
    setUserType("");
    setUIN("");
    setfName("");
    setlName("");
    setMInitial("");
    setEmail("");
    setDiscord("");
    setUsername("");

    setGender("");
    setHispanicLatino("");
    setRace("");
    setCitizen("");
    setFirstGen("");
    setDOB("");
    setGPA("");
    setMajor("");
    setMinor1("");
    setMinor2("");
    setGradYear("");
    setSchool("");
    setClassification("");
    setStudentType("");
    setPhone("");
    setShowStudent(false);
    setShow(false);
  }

  const getTable = () => {
    const list = [];
    for(let k = 0; k < allUserData.length; k++) {
        

        const temp = <tr key={k}>
                        <td>{allUserData[k].uin}</td>
                        <td>{allUserData[k].first_name} {allUserData[k].m_initial}. {allUserData[k].last_name}</td>
                        <td>{allUserData[k].email}</td>
                        <td>{allUserData[k].username}</td>
                        <td>{allUserData[k].discord}</td>
                        <td>
                            <Button variant="success btn-sm" onClick={() => studentHandler(allUserData[k].uin, allUserData[k].userType)}>
                                Edit
                            </Button>
                        </td>
                      </tr>
        list.push(temp);
    }
    return list;
  }

  return (
    <div className="Programs">
    {/*
    
    MODAL STARTS HERE
    
    */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>
          <i>{fname} {m_initial}. {lname}</i>
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        Account Information:
        <Row>
          <Col style={{textAlign: "Right"}}>
            <b>UIN:</b>
          </Col>
          <Col>
            {uin}
          </Col>
        </Row>
        <Row>
          <Col style={{textAlign: "Right"}}>
            <b>First Name:</b>
          </Col>
          <Col>
            {fname}
          </Col>
        </Row>
        <Row>
          <Col style={{textAlign: "Right"}}>
            <b>Last Name:</b>
          </Col>
          <Col>
            {lname}
          </Col>
        </Row>
        <Row>
          <Col style={{textAlign: "Right"}}>
            <b>M Initial:</b>
          </Col>
          <Col>
            {m_initial}
          </Col>
        </Row>
        <Row>
          <Col style={{textAlign: "Right"}}>
            <b>Email:</b>
          </Col>
          <Col>
            {email}
          </Col>
        </Row>
        <Row>
          <Col style={{textAlign: "Right"}}>
            <b>Discord:</b>
          </Col>
          <Col>
            {discord}
          </Col>
        </Row>
        <Row>
          <Col style={{textAlign: "Right"}}>
            <b>Username:</b>
          </Col>
          <Col>
            {username}
          </Col>
        </Row>

        {currentUserType === "Student" &&
          <React.Fragment>
            <br/>
            <Button variant="primary" onClick={()=>{setShowStudent(!showStudent)}}>Show Student Information</Button>
            { showStudent &&
              <React.Fragment>
                <br/>
                <Row>
                  <Col style={{textAlign: "Right"}}>
                    <b>Gender:</b>
                  </Col>
                  <Col>
                    {gender}
                  </Col>
                </Row>
                <Row>
                  <Col style={{textAlign: "Right"}}>
                    <b>Hispanic/Latino:</b>
                  </Col>
                  <Col>
                    {hispaniclatino}
                  </Col>
                </Row>
                <Row>
                  <Col style={{textAlign: "Right"}}>
                    <b>Race:</b>
                  </Col>
                  <Col>
                    {race}
                  </Col>
                </Row>
                <Row>
                  <Col style={{textAlign: "Right"}}>
                    <b>US Citizen:</b>
                  </Col>
                  <Col>
                    {citizen}
                  </Col>
                </Row>
                <Row>
                  <Col style={{textAlign: "Right"}}>
                    <b>First Gen Student:</b>
                  </Col>
                  <Col>
                    {firstGen}
                  </Col>
                </Row>
                <Row>
                  <Col style={{textAlign: "Right"}}>
                    <b>Date of Birth:</b>
                  </Col>
                  <Col>
                    {dob}
                  </Col>
                </Row>
                <Row>
                  <Col style={{textAlign: "Right"}}>
                    <b>GPA:</b>
                  </Col>
                  <Col>
                    {gpa}
                  </Col>
                </Row>
                <Row>
                  <Col style={{textAlign: "Right"}}>
                    <b>Major:</b>
                  </Col>
                  <Col>
                    {major}
                  </Col>
                </Row>
                <Row>
                  <Col style={{textAlign: "Right"}}>
                    <b>Minor 1:</b>
                  </Col>
                  <Col>
                    {minor1}
                  </Col>
                </Row>
                <Row>
                  <Col style={{textAlign: "Right"}}>
                    <b>Minor 2:</b>
                  </Col>
                  <Col>
                    {minor2}
                  </Col>
                </Row>
                <Row>
                  <Col style={{textAlign: "Right"}}>
                    <b>Exp. Graduation Year:</b>
                  </Col>
                  <Col>
                    {gradYear}
                  </Col>
                </Row>
                <Row>
                  <Col style={{textAlign: "Right"}}>
                    <b>School:</b>
                  </Col>
                  <Col>
                    {school}
                  </Col>
                </Row>
                <Row>
                  <Col style={{textAlign: "Right"}}>
                    <b>Classification:</b>
                  </Col>
                  <Col>
                    {classification}
                  </Col>
                </Row>
                <Row>
                  <Col style={{textAlign: "Right"}}>
                    <b>Student Type:</b>
                  </Col>
                  <Col>
                    {studentType}
                  </Col>
                </Row>
                <Row>
                  <Col style={{textAlign: "Right"}}>
                    <b>Phone:</b>
                  </Col>
                  <Col>
                    {phone}
                  </Col>
                </Row>
              </React.Fragment>
            }
          </React.Fragment>
        }
        <br/>
        add tracking stuff here
        </Modal.Body>
      </Modal>
      {/*

      MAIN BODY STARTS HERE

      */}
      <Container>
        {loading ? (
          <center>
            {" "}
            <Spinner animation="border" />{" "}
          </center>
        ) : (
          <React.Fragment>
            <br/>
            <h2 className="display-5 text-center">{programInfo.program_name}</h2>
            <p className="text-center">{programInfo.program_description}</p>

            {props.auth.user.user_type == "Admin" ? (
                // Return a table with all students information who are in this program (programNum)
                // Each row in the table should be able to view more details in a modal to see more details/edit students
                <React.Fragment>
                  <p>Number of Enrolled Students: {studentCount}</p>
                  <br/>
                  <p>Hispanic/Latino Students: {hisplatCounts}</p>
                  <p>Races:</p>
                  <ul>
                  {Object.keys(raceCounts).map((race) => (
                    <li>{race}: {raceCounts[race]} ({(100*raceCounts[race]/studentCount).toFixed(2)}%)</li>
                  ))}
                  </ul>
                  <p>Majors:</p>
                  <ul>
                  {Object.keys(majorCounts).map((major) => (
                    <li>{major}: {majorCounts[major]} ({(100*majorCounts[major]/studentCount).toFixed(2)}%)</li>
                  ))}
                  </ul>
                  <div className="Admin Table">
                      <h2 className="display-5 text-center">Enrolled Students</h2>
                          <Table striped bordered hover className="text-center">
                              <thead>
                                  <tr>
                                      <th className="col-md-1">UIN</th>
                                      <th className="col-md-2">Name</th>
                                      <th className="col-md-2">Email</th>
                                      <th className="col-md-2">Username</th>
                                      <th className="col-md-2">Discord</th>
                                      <th className="col-md-1">Edit</th>
                                  </tr>
                              </thead>
                              <tbody>{getTable()}</tbody>
                          </Table>
                          <br></br>
                  </div>
                {/*No other tracking stuff needed?*/}
                </React.Fragment>
            ) : (
                // If the user is a student, they should have buttons to add new certifiates/classes/internships to the program
                // Allow the user to see their progress in the program
                <p>add tracking stuff here</p>


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
