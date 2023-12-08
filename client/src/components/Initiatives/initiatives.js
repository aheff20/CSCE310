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
  const [allClassData, setClassData] = useState({});
  const [allInternshipData, setInternshipData] = useState({});
  const [allCertificateData, setCertificateData] = useState({});
  const [allProgramData, setProgramData] = useState({});
  const [loading, setLoading] = useState(true);

  // modal info
  const [initiativeType, setInitiativeType] = useState("Choose Type");
  const [showInitiative, setShowInitiative] = useState(false);
  const [isNew, setIsNew] = useState("Select Option"); // "Select Existing" or "Create New"
  const [error, setError] = useState({});
  // general body info
  const [initiativeID, setInitiativeID] = useState(-1);
  const [initiativeName, setInitiativeName] = useState("");
  const [initiativeDesc, setInitiativeDesc] = useState("");
  const [initiativeOptions, setInitiativeOptions] = useState([<option value={-1}>Choose Option</option>]);
  const [selectOption, setSelectOption] = useState(-1);
  // specific init info
  const [classType, setClassType] = useState("");
  const [internshipIsGov, setIsGov] = useState("Select Option"); // "yes" or "no"
  const [certLevel, setCertLevel] = useState("");
  // general application info
  const [isApplying, setIsApplying] = useState(false);
  const [initiativeNum, setInitiativeNum] = useState(-1);
  const [UIN, setUIN] = useState(-1);
  const [appStatus, setAppStatus] = useState("");
  const [appYear, setAppYear] = useState(new Date().getFullYear());
  // specific application info
  const [appSemester, setAppSemester] = useState("Select Option");
  const [certAppTraining, setCertAppTraining] = useState("");
  const [certAppProgramNum, setCertAppProgramNum] = useState(-1);
  const [certProgramOptions, setCertProgramOptions] = useState([<option value={-1}>Choose Option</option>]);
  

  useEffect(() => {
    /*
    if (props.auth.user.user_type == "Admin") {
      history.replace("/");
    }
    */
    axios.get("/initiatives/getAllClassData")
      .then((res) => {
        setClassData(res.data);
        //console.log(res.data);
        axios.get("/initiatives/getAllInternshipData")
          .then((res) => {
            setInternshipData(res.data);
            //console.log(res.data);
            axios.get("/initiatives/getAllCertificateData")
              .then((res) => {
                setCertificateData(res.data);
                //console.log(res.data);
                setLoading(false);

                axios.get("/programs/getAllProgramData")
                  .then((res) => {
                    updateProgramOptionsHandler(res.data);
                  })
              })
          })
      })

  }, []);

  const openInitiativeHandler = (applyStatus) => {
    setIsApplying(applyStatus);
    if (!applyStatus) {
      setIsNew("Create New");
    }
    setShowInitiative(true);
  }

  const resetModalValues = () => {
    setInitiativeType("Choose Type");
    setIsNew("Select Option");

    setInitiativeID(-1);
    setInitiativeName("");
    setInitiativeDesc("");
    setInitiativeOptions([<option value={-1}>Choose Option</option>]);
    setSelectOption(-1);

    setClassType("");
    setIsGov("");
    setCertLevel("");

    setIsApplying(false);
    setInitiativeNum(-1);
    setUIN(-1);
    setAppStatus("");
    setAppYear(new Date().getFullYear());
    
    setAppSemester("Select Option");
    setCertAppTraining("");
    setCertAppProgramNum(-1);

    setShowInitiative(false);
  }

  const changeInitiativeTypeHandler = (type) => {
    setInitiativeType(type);
    let opts = [];
    //console.log(opts);
    if (type == "Class" && allClassData.length > 0) opts = allClassData.map((Class) => (
      <option value={Class.class_id}>{Class.class_name}</option>
    ));
    else if (type == "Internship" && allInternshipData.length > 0) opts = allInternshipData.map((Internship) => (
      <option value={Internship.intern_id}>{Internship.company_name}</option>
    ));
    else if (type == "Certificate" && allCertificateData.length > 0) opts = allCertificateData.map((Certificate) => (
      <option value={Certificate.cert_id}>{Certificate.cert_name}</option>
    ));
    opts.unshift(
      <option value={-1}>Choose Option</option>
    );
    console.log(opts);
    setInitiativeOptions(opts);
  }

  const updateProgramOptionsHandler = (data) => {
    let dataf = data.filter((program) => (program.active));
    setProgramData(dataf);

    let opts = [];
    if (dataf.length > 0) opts = dataf.map((program) => (
      <option value={program.program_num}>{program.program_name}</option>
    ))
    opts.unshift(
      <option value={-1}>Choose Option</option>
    );

    setCertProgramOptions(opts);
  }

  const updateSelectionHandler = (id) => {
    setSelectOption(id);
    setInitiativeNum(id);
    if (id < 0) {
      setInitiativeName("");
      setInitiativeDesc("");
      setClassType("");
      setIsGov("Select Option");
      setCertLevel("");
      return;
    }

    if (initiativeType==="Class") {
      let Class = allClassData.filter((Class) => (Class.class_id))[0];
      if (Class) {
        console.log(Class);
        setInitiativeName(Class.class_name);
        setInitiativeDesc(Class.class_description);
        setClassType(Class.class_type);
      }
    }

    if (initiativeType==="Internship") {
      let Internship = allInternshipData.filter((Internship) => (Internship.intern_id))[0];
      if (Internship) {
        console.log(Internship);
        setInitiativeName(Internship.company_name);
        setInitiativeDesc(Internship.intern_description);
        setIsGov(Internship.is_gov);
      }
    }

    if (initiativeType==="Certificate") {
      let Cert = allCertificateData.filter((Cert) => (Cert.cert_id))[0];
      if (Cert) {
        console.log(Cert);
        setInitiativeName(Cert.cert_name);
        setInitiativeDesc(Cert.cert_description);
        setCertLevel(Cert.cert_level);
      }
    }
    
  }

  const createInitiativeHandler = () => {
    changeInitiativeTypeHandler("Choose Type");
  }

  const editClassHandler = () => {

  }

  const editInternshipHandler = () => {

  }

  const editCertificateHandler = () => {

  }

  const deleteClassHandler = () => {

  }

  const deleteInternshipHandler = () => {

  }

  const deleteCertificateHandler = () => {

  }

  return (
    <div className="Profile">
      <Modal show={showInitiative} onHide={resetModalValues}>
        <Modal.Header closeButton>
          <Modal.Title>
            Creating a New Initiative
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={4}>
              <b>Initiative Type:</b>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Select
                aria-label="Initiative Type"
                value={initiativeType}
                isInvalid={!!error.gender}
                onChange={(e) => {
                  {
                    changeInitiativeTypeHandler(e.target.value);
                    updateSelectionHandler(-1);
                  }
                }}
                >
                  <option>Choose Type</option>
                  <option>Class</option>
                  <option>Internship</option>
                  <option>Certificate</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          {props.auth.user.user_type === "Admin" &&
            <Row>
              <Col sm={4}>
                <b>Apply a student</b>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="isApplying"
                    defaultChecked={isApplying}
                    onChange={(e) => {
                      if(isApplying) setIsNew("Create New");
                      setIsApplying(!isApplying);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
          }
          {isApplying && 
            <Row>
              <Col sm={4}>
                <b>Select Existing or Create New</b>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Select
                  aria-label="Select Existing or Create New"
                  value={isNew}
                  isInvalid={!!error.isNew}
                  onChange={(e) => {
                    {
                      setIsNew(e.target.value);
                      updateSelectionHandler(-1);
                    }
                  }}
                  >
                    <option>Select Option</option>
                    <option>Select Existing</option>
                    <option>Create New</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          }
          {isNew === "Select Existing" &&
            <React.Fragment>
              <Row>
                <Col sm={4}>
                  <b>Selection Options: </b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Select
                    aria-label="Selection Options"
                    value={selectOption}
                    isInvalid={!!error.isNew}
                    onChange={(e) => {
                      updateSelectionHandler(e.target.value);
                    }}
                    >
                      {initiativeOptions}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </React.Fragment>
          }
          
          {initiativeType !== "Choose Type" && isNew!=="Select Option" &&
            <React.Fragment>
              <hr />
              <Row>
                <Col sm={4}>
                  <b>Name: </b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Control
                    value={initiativeName}
                    isInvalid={!!error.initiativeName}
                    onChange={(e) => {
                      setInitiativeName(e.target.value);
                    }}
                    required
                    id="Initiative Name"
                    type="text"
                    disabled = {isNew === "Select Existing"}
                    >
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <b>Description: </b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Control
                    value={initiativeDesc}
                    isInvalid={!!error.initiativeDesc}
                    onChange={(e) => {
                      setInitiativeDesc(e.target.value);
                    }}
                    id="Initiative Description"
                    type="text"
                    disabled = {isNew === "Select Existing"}
                    >
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              {initiativeType==="Class" &&
                <React.Fragment>
                  <Row>
                    <Col sm={4}>
                      <b>Class Type: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                        value={classType}
                        isInvalid={!!error.classType}
                        onChange={(e) => {
                          setClassType(e.target.value);
                        }}
                        id="Class Type"
                        type="text"
                        disabled = {isNew === "Select Existing"}
                        >
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </React.Fragment>
              }
              {initiativeType==="Internship" &&
                <React.Fragment>
                  <Row>
                    <Col sm={4}>
                      <b>Is Gov: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Select
                        aria-label="Is Gov"
                        value={internshipIsGov}
                        isInvalid={!!error.internshipIsGov}
                        disabled = {isNew === "Select Existing"}
                        onChange={(e) => {
                          setIsGov(e.target.value);
                        }}
                        >
                          <option>Select Option</option>
                          <option>Yes</option>
                          <option>No</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </React.Fragment>
              }
              {initiativeType==="Certificate" &&
                <React.Fragment>
                  <Row>
                    <Col sm={4}>
                      <b>Certificate Level: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                        value={certLevel}
                        isInvalid={!!error.certLevel}
                        onChange={(e) => {
                          setClassType(e.target.value);
                        }}
                        id="Certificate Level"
                        type="text"
                        disabled = {isNew === "Select Existing"}
                        >
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </React.Fragment>
              }
              
              {isApplying && 
                <React.Fragment>
                  <hr/>
                  <Row>
                    <Col sm={4}>
                      <b>Application Status: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                        value={appStatus}
                        isInvalid={!!error.appStatus}
                        onChange={(e) => {
                          setAppStatus(e.target.value);
                        }}
                        required
                        id="Application Status"
                        type="text"
                        >
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <b>Application Year: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                        value={appYear}
                        isInvalid={!!error.appStatus}
                        onChange={(e) => {
                          setAppYear(e.target.value);
                        }}
                        required
                        id="Application Year"
                        type="number"
                        min="0"
                        >
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  {(initiativeType==="Class" || initiativeType=="Certificate") && 
                    <React.Fragment>
                      <Row>
                        <Col sm={4}>
                          <b>Semester: </b>
                        </Col>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Select
                            aria-label="Application Semester"
                            value={appSemester}
                            isInvalid={!!error.appSemester}
                            onChange={(e) => {
                              setAppSemester(e.target.value);
                            }}
                            >
                              <option>Select Option</option>
                              <option>Spring</option>
                              <option>Summer</option>
                              <option>Fall</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </React.Fragment>
                  }
                  {initiativeType=="Certificate" &&
                    <React.Fragment>
                      <Row>
                        <Col sm={4}>
                          <b>Training Status: </b>
                        </Col>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Control
                            value={certAppTraining}
                            isInvalid={!!error.certAppTraining}
                            onChange={(e) => {
                              setCertAppTraining(e.target.value);
                            }}
                            required
                            id="Certification Training Status"
                            type="text"
                            >
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={4}>
                          <b>Program: </b>
                        </Col>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Select
                            aria-label="Program Options"
                            value={certAppProgramNum}
                            isInvalid={!!error.certAppProgramNum}
                            onChange={(e) => {
                              setCertAppProgramNum(e.target.value);
                            }}
                            >
                              {certProgramOptions}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </React.Fragment>
                  }
                </React.Fragment>
              }

            </React.Fragment>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetModalValues}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createInitiativeHandler}>
            Confirm
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
            <br/>
            <h1 className="display-5 text-center">Initiatives</h1>
            <div className="col d-flex justify-content-center align-items-center">
              <Button variant="primary" onClick={() => openInitiativeHandler(props.auth.user.user_type === "Student")}>
                Create Initiative
              </Button>
            </div>
            {props.auth.user.user_type == "Admin" ? (
              <React.Fragment>
                <h2 className="display-5 text-center">Classes</h2>
                <h2 className="display-5 text-center">Internships</h2>
                <h2 className="display-5 text-center">Certificates</h2>
              </React.Fragment>
            ):(
              <React.Fragment>
                <h2 className="display-5 text-center">Classes</h2>
                <h2 className="display-5 text-center">Internships</h2>
                <h2 className="display-5 text-center">Certificates</h2>
              </React.Fragment>
            )}
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
