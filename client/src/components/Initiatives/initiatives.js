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
  const [loading, setLoading] = useState(true);

  // modal info
  const [initiativeType, setInitiativeType] = useState("Choose Type");
  const [showInitiative, setShowInitiative] = useState(false);
  const [isNew, setIsNew] = useState("Select Option"); // "yes" or "no"
  const [error, setError] = useState({});
  // general body info
  const [initiativeID, setInitiativeID] = useState(0);
  const [initiativeName, setInitiativeName] = useState("");
  const [initiativeDesc, setInitiativeDesc] = useState("");
  const [initiativeOptions, setInitiativeOptions] = useState([<option value={-1}>Choose Option</option>]);
  const [selectOption, setSelectOption] = useState(-1);
  // specific init info
  const [classType, setClassType] = useState("");
  const [internshipIsGov, setIsGov] = useState("Select Option"); // "yes" or "no"
  const [certLevel, setCertLevel] = useState("");
  // general application info
  const [initiativeNum, setInitiativeNum] = useState(0);
  const [UIN, setUIN] = useState(0);
  const [appStatus, setAppStatus] = useState("");
  const [appYear, setAppYear] = useState(0);
  // specific application info
  const [appSemester, setAppSemester] = useState("");
  const [certAppTraining, setCertAppTraining] = useState("");
  const [certAppProgramNum, setCertAppProgramNum] = useState(0);
  

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
              })
          })
      })

  }, []);

  const openInitiativeHandler = () => {
    setShowInitiative(true);
  }

  const closeInitiativeHandler = () => {
    setShowInitiative(false);
  }

  const changeInitiativeTypeHandler = (type) => {
    setInitiativeType(type);
    let opts = [];
    //console.log(opts);
    if (type == "Class" && allClassData.length > 0) opts = allClassData.map((Class) => {
      <option value={Class.class_id}>{Class.class_name}</option>
    });
    else if (type == "Internship" && allInternshipData.length > 0) opts = allInternshipData.map((Internship) => {
      <option value={Internship.intern_id}>{Internship.company_name}</option>
    });
    else if (type == "Certificate" && allCertificateData.length > 0) opts = allCertificateData.map((Certificate) => {
      <option value={Certificate.cert_id}>{Certificate.cert_name}</option>
    });
    opts.unshift(
      <option value={-1}>Choose Option</option>
    );
    //console.log(opts);
    setInitiativeOptions(opts);
  }

  const updateSelectionHandler = (id) => {
    setSelectOption(id);
    if (id < 0) {
      setInitiativeName("");
      setInitiativeDesc("");
      setClassType("");
      setIsGov("Select Option");
      setCertLevel("");
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
      <Modal show={showInitiative} onHide={closeInitiativeHandler}>
        <Modal.Header closeButton>
          <Modal.Title>
            Creating a new Initiative
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
          <Row>
            <Col sm={4}>
              <b>Select Existing or Create New</b>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Select
                aria-label="Initiative Type"
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
              <hr/>
              {/*
                * status
                * year
                * ----
                * class semester
                * certificate training_status, program_num, semester
                */}

            </React.Fragment>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeInitiativeHandler}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createInitiativeHandler}>
            Create Initiative
          </Button>
        </Modal.Footer>
      </Modal>
      <Container>
        {loading ? (
            <center>
                {" "}
                <Spinner animation="border" />{" "}
            </center>
        ):( props.auth.user.user_type == "Admin" ? (
            <></>
        ):(
            <React.Fragment>
                <br/>
                <h1 className="display-5 text-center">My Initiatives</h1>
                <div className="col d-flex justify-content-center align-items-center">
                  <Button variant="primary" onClick={() => openInitiativeHandler()}>Create Initiative</Button>
                </div>
                <h2 className="display-5 text-center">Classes</h2>
                <h2 className="display-5 text-center">Internships</h2>
                <h2 className="display-5 text-center">Certificates</h2>
                
            </React.Fragment>
        ))}
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
