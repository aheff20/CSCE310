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
  const [userApplications, setUserApplications] = useState([]);
  const [currentProgramNum, setCurrentProgramNum] = useState([]);
  const [currentProgramName, setCurrentProgramName] = useState([]);
  const [currentProgramDescription, setCurrentProgramDescription] = useState([]);
  const [currentAppNum, setCurrentAppNum] = useState([]);
  const [currentAppUncomcert, setCurrentAppUncomcert] = useState("");
  const [currentAppCert, setCurrentAppCert] = useState("");
  const [currentAppPurpose, setCurrentAppPurpose] = useState("");
  const [deleteProgramConfirmation, setDeleteProgramConfirmation] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEditProgram, setShowEditProgram] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [showEditApplication, setShowEditApplication] = useState(false);
  const [deleteApplicationConfirmation, setDeleteApplicationConfirmation] = useState(false);
  const [error, setError] = useState({});


  const [numDocuments, setNumDocuments] = useState(1);
  const [link1, setLink1] = useState("");
  const [doc_type1, setDocType1] = useState("");

  const [link2, setLink2] = useState("");
  const [doc_type2, setDocType2] = useState("");

  const [link3, setLink3] = useState("");
  const [doc_type3, setDocType3] = useState("");

  const [link4, setLink4] = useState("");
  const [doc_type4, setDocType4] = useState("");

  const [link5, setLink5] = useState("");
  const [doc_type5, setDocType5] = useState("");


  useEffect(() => {
    axios
      .get("/programs/getAllProgramData", {
        params: {
          uin: props.auth.user.uin
        }
      })
      .then((res) => {
        setAllProgramData(res.data);
      });

    axios
      .get("/programs/getAllUserApplications", {
        params: {
          uin: props.auth.user.uin
        }
      })
      .then((res) => {
        setUserApplications(res.data);
        setLoading(false);
      });

  }, []);

  const handleCreateNewProgram = () => {
    console.log(`Creating new program`);
    setShowCreate(true);
  }

  const handleConfirmCreate = () => {
    const isNameUnique = allProgramData.every((program) => program.program_name !== currentProgramName);

    if (!isNameUnique) {
      setError({ program_name: "This Program name is already taken!" });
      return;
    }

    axios
      .post("programs/createProgram", {
        program_name: currentProgramName,
        program_description: currentProgramDescription,
      })
      .then((res) => {
        if (res.status === 201) {
          console.log(res.data)
          setError(res.data);
        } else {
          history.go(0);
          setShowCreate(false);
        }
      })
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
        setShowEditProgram(true);
      })
  };

  const applyToProgram = (programNum) => {
    console.log(`Applying to program ${programNum}`);
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
        setShowApply(true);
      })
  }

  const handleEditApplication = (programNum) => {
    console.log(`Editing Application to program ${programNum}`);
    const application = userApplications.find(app => app.program_num === programNum);
    setCurrentAppNum(application.app_num);
    setCurrentAppCert(application.com_cert);
    setCurrentAppUncomcert(application.uncom_cert);
    setCurrentAppPurpose(application.purpose_statement);
    allDocumentInfo(application.app_num);
    setShowEditApplication(true);
  };

  const handleConfirmApplication = () => {
    console.log(`Confirmed application to program ${currentProgramNum}`);
    axios
      .post("programs/createApplication", {
        program_num: currentProgramNum,
        uin: props.auth.user.uin,
        uncom_cert: currentAppUncomcert,
        com_cert: currentAppCert,
        purpose: currentAppPurpose
      })
      .then((res) => {
        if(numDocuments > 0){
          axios.post("programs/createDocument", {app_num: res.data.app_num, link: link1,doc_type: doc_type1,})
        }
        if(numDocuments > 1){
          axios.post("programs/createDocument", {app_num: res.data.app_num, link: link2,doc_type: doc_type2,})
        }
        if(numDocuments > 2){
          axios.post("programs/createDocument", {app_num: res.data.app_num, link: link3,doc_type: doc_type3,})
        }
        if(numDocuments > 3){
          axios.post("programs/createDocument", {app_num: res.data.app_num, link: link4,doc_type: doc_type4,})
        }
        if(numDocuments > 4){
          axios.post("programs/createDocument", {app_num: res.data.app_num, link: link5,doc_type: doc_type5,})
        }
    
        history.go(0);
        setShowApply(false);
      })
  }

  const handleDeleteApplication = (programNum) => {
    setDeleteApplicationConfirmation(true);
  };

  const confirmDeleteApplication = () => {
    console.log(`Deleting application ${currentAppNum}`);
    Promise.all([
      axios.post("programs/deleteDocumentsOfApplication", { app_num: currentAppNum }).then((res) =>{
        axios.post("programs/deleteApplication", {app_num: currentAppNum});
      })
    ])
      .then((res) => {
        if (res.status === 201) {
          console.log(res.data);
          setError(res.data);
        } else {
          history.go(0);
          handleClose();
          setDeleteApplicationConfirmation(false);
        }
      })

  };

  const cancelDeleteApplication = () => {
    setDeleteApplicationConfirmation(false);
  };

  const accessProgramHandler = (programNum, isActive) => {
    console.log(`Changing active status of program ${programNum} to ${!isActive}`);
    const programToUpdate = allProgramData.find((program) => program.program_num === programNum);
    programToUpdate.active = !isActive;

    axios
      .post("/programs/updateProgramActiveStatus", { program: programToUpdate })
      .then((res) => {
        if (res.status === 201) {
          console.log(res.data)
          setError(res.data);
        } else {
          history.go(0);
        }
      })
  }

  const handleDeleteProgram = (programNum) => {
    setDeleteProgramConfirmation(true);
  };

  const confirmDeleteProgram = () => {
    // track, then applications, (then maybe events and cert_enrollments, add later), then the program itself

    console.log(`Deleting program ${currentProgramNum}`);
    axios
      .post("/programs/deleteProgramTrack", { program_num: currentProgramNum })
      .then((res) => {
        if (res.status === 201) {
          console.log(res.data);
          setError(res.data);
          return;
        }

        axios
          .post("/programs/deleteProgramApplications", { program_num: currentProgramNum })
          .then((res) => {
            if (res.status === 201) {
              console.log(res.data);
              setError(res.data);
              return;
            }

            axios
              .post("/programs/deleteProgram", { program_num: currentProgramNum })
              .then((res) => {
                if (res.status === 201) {
                  console.log(res.data);
                  setError(res.data);
                } else {
                  history.go(0);
                  handleClose();
                  setDeleteProgramConfirmation(false);
                }
              });
          });
      });
  };

  const cancelDeleteProgram = () => {
    setDeleteProgramConfirmation(false);
  };

  const programDetailsHandler = (programNum) => {
    history.push("/programs/" + programNum);

  }

  /**
     * Send updated program information to backend, refresh the page and close the modal
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
          setShowEditProgram(false);
        }
      })
  }

  /**
     * Send updated application information to backend, refresh the page and close the modal
     */
  const handleSaveApplication = () => {
    let updateParams = {};

    updateParams["app_num"] = currentAppNum;
    updateParams["updatedUncomCert"] = currentAppUncomcert;
    updateParams["updatedCert"] = currentAppCert;
    updateParams["updatedPurpose"] = currentAppPurpose;

    axios
      .post("/programs/updateApplicationInfo", updateParams)
      .then((res) => {
        if (res.status === 201) {
          console.log(res.data)
          setError(res.data);
        } else {
          allProgramDataEdit(currentAppNum);
          handleClose();
        }
      })
  }

  /**
   * Reset all modal information and close modal
   */
  const handleClose = () => {
    setCurrentProgramNum("");
    setCurrentProgramName("");
    setCurrentProgramDescription("");
    setCurrentAppUncomcert("");
    setCurrentAppCert("");
    setCurrentAppPurpose("");
    setShowEditProgram(false);
    setShowCreate(false);
    setShowApply(false);
    setShowEditApplication(false);

    setNumDocuments(1);
    setDocType1("");
    setLink1("");
    setDocType2("");
    setLink2("");
    setDocType3("");
    setLink3("");
    setDocType4("");
    setLink4("");
    setDocType5("");
    setLink5("");
  }

  /**
    Implemented by: Billy Harkins
    changes state of document info to be current with user edits
  */
  const allDocumentInfo = (app_num) => {
    axios
      .get("/programs/getUploadedDocuments", {
        params: {
          app_num: app_num,
        }
      })
      .then((res) => {
        if(res.data.length > 0){
          setLink1(res.data[0].link);
          setDocType1(res.data[0].doc_type);
        }
        if(res.data.length > 1){
          setLink2(res.data[1].link);
          setDocType2(res.data[1].doc_type);
        }
        if(res.data.length > 2){
          setLink3(res.data[2].link);
          setDocType3(res.data[2].doc_type);
        }
        if(res.data.length > 3){
          setLink4(res.data[3].link);
          setDocType4(res.data[3].doc_type);
        }
        if(res.data.length > 4){
          setLink5(res.data[4].link);
          setDocType5(res.data[4].doc_type);
        }
      });
  }

  /**
    Implemented by: Billy Harkins
    edits database to reflect user changes to document links and types
  */
  const allProgramDataEdit = (app_num) => {
    axios
    .get("/programs/getUploadedDocuments", {
      params: {
        app_num: app_num,
      }
    })
    .then((res) => {
      console.log(res);
      if(res.data.length > 0){
        console.log(link1, doc_type1);
        axios
        .post("/programs/updateDocument", {
          doc_num: res.data[0].doc_num,
          link: link1,
          doc_type: doc_type1
        })
      }
      if(res.data.length > 1){
        console.log(link2, doc_type2);
        axios
        .post("/programs/updateDocument", {
          doc_num: res.data[1].doc_num,
          link: link2,
          doc_type: doc_type2
        })
      }
      if(res.data.length > 2){
        axios
        .post("/programs/updateDocument", {
          doc_num: res.data[2].doc_num,
          link: link3,
          doc_type: doc_type3
        })
      }
      if(res.data.length > 3){
        axios
        .post("/programs/updateDocument", {
          doc_num: res.data[3].doc_num,
          link: link4,
          doc_type: doc_type4
        })
      }
      if(res.data.length > 4){
        axios
        .post("/programs/updateDocument", {
          doc_num: res.data[4].doc_num,
          link: link5,
          doc_type: doc_type5
        })
      }
    })
  }

  const programsForUser = allProgramData.map((program) => {
    const application = userApplications.find(app => app.program_num === program.program_num);
    const appNum = application ? application.app_num : null;

    return (
      <ProgramCard
        key={program.program_num}
        isAdmin={props.auth.user.user_type === "Admin"}
        programData={program}
        applicationNum={appNum}
        editProgramHandler={() => handleEditProgram(program.program_num)}
        applyToProgram={() => applyToProgram(program.program_num)}
        editApplication={() => handleEditApplication(program.program_num)}
        accessProgramHandler={() => accessProgramHandler(program.program_num, program.active)}
        programDetailsHandler={() => programDetailsHandler(program.program_num)}
      />
    )
  })

  return (
    <div className="Programs">
      <Modal show={showCreate} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Creating a new Program
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={6}>
              <b>Program Name: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => setCurrentProgramName(e.target.value)}
                  required
                  value={currentProgramName}
                  id="pname"
                  type="text"
                  isInvalid={error.program_name}
                />
                <Form.Control.Feedback type="invalid">{error.program_name}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <b>Program Description: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => setCurrentProgramDescription(e.target.value)}
                  required
                  value={currentProgramDescription}
                  id="pdesc"
                  type="textarea"
                  isInvalid={error.program_description}
                />
                <Form.Control.Feedback type="invalid">{error.program_description}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmCreate}>
            Create Program
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditProgram} onHide={handleClose}>
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
              <Form.Group>
                <Form.Control
                  onChange={(e) => setCurrentProgramName(e.target.value)}
                  required
                  value={currentProgramName}
                  id="pname"
                  type="text"
                  isInvalid={error.program_name}
                />
                <Form.Control.Feedback type="invalid">{error.program_name}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <b>Program Description: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => setCurrentProgramDescription(e.target.value)}
                  required
                  value={currentProgramDescription}
                  id="pdesc"
                  type="textarea"
                  isInvalid={error.program_description}
                />
                <Form.Control.Feedback type="invalid">{error.program_description}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteProgram}>
            Delete Program
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={deleteProgramConfirmation} onHide={cancelDeleteProgram}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Program</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the program? This action CANNOT be undone!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteProgram}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteProgram}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showApply} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Applying: <i>{currentProgramName}</i>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={6}>
              <b>Are you currently enrolled in other uncompleted certifications sponsored by the Cybersecurity Center? </b>
            </Col>
            <Col>
              <Form.Control
                onChange={(e) => setCurrentAppUncomcert(e.target.value)}
                required
                value={currentAppUncomcert}
                id="appucomcert"
                as="textarea"
                isInvalid={error.program_name}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <b>Have you completed any cybersecurity industry certifications via the Cybersecurity Center? </b>
            </Col>
            <Col>
              <Form.Control
                onChange={(e) => setCurrentAppCert(e.target.value)}
                required
                value={currentAppCert}
                id="appcert"
                as="textarea"
                isInvalid={error.program_description}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <b>Purpose Statement: </b>
            </Col>
            <Col>
              <Form.Control
                onChange={(e) => setCurrentAppPurpose(e.target.value)}
                required
                value={currentAppPurpose}
                id="apppurp"
                as="textarea"
                isInvalid={error.program_description}
              />
            </Col>
          </Row>
          <br></br>
          <Row>
            <b>Document Upload: </b>
          </Row>
          <br></br>
          <Row hidden={numDocuments <= 0}>
            <Col sm={6}>
              <b>Enter Document Type: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setDocType1(e.target.value);
                  }}
                  value={doc_type1}
                  id="fileType"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row hidden={numDocuments <= 0}>
            <Col sm={6}>
              <b>Enter Link: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setLink1(e.target.value);
                  }}
                  value={link1}
                  id="fileUpload"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <br hidden={numDocuments <= 1}></br>

          <Row hidden={numDocuments <= 1}>
            <Col sm={6}>
              <b>Enter Document Type: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setDocType2(e.target.value);
                  }}
                  value={doc_type2}
                  id="fileType"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row hidden={numDocuments <= 1}>
            <Col sm={6}>
              <b>Enter Link: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setLink2(e.target.value);
                  }}
                  value={link2}
                  id="fileUpload"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <br hidden={numDocuments <= 2}></br>

          <Row hidden={numDocuments <= 2}>
            <Col sm={6}>
              <b>Enter Document Type: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setDocType3(e.target.value);
                  }}
                  value={doc_type3}
                  id="fileType"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row hidden={numDocuments <= 2}>
            <Col sm={6}>
              <b>Enter Link: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setLink3(e.target.value);
                  }}
                  value={link3}
                  id="fileUpload"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <br hidden={numDocuments <= 3}></br>

          <Row hidden={numDocuments <= 3}>
            <Col sm={6}>
              <b>Enter Document Type: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setDocType4(e.target.value);
                  }}
                  value={doc_type4}
                  id="fileType"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row hidden={numDocuments <= 3}>
            <Col sm={6}>
              <b>Enter Link: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setLink4(e.target.value);
                  }}
                  value={link4}
                  id="fileUpload"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <br hidden={numDocuments <= 4}></br>

          <Row hidden={numDocuments <= 4}>
            <Col sm={6}>
              <b>Enter Document Type: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setDocType5(e.target.value);
                  }}
                  value={doc_type5}
                  id="fileType"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row hidden={numDocuments <= 4}>
            <Col sm={6}>
              <b>Enter Link: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setLink5(e.target.value);
                  }}
                  value={link5}
                  id="fileUpload"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row hidden={numDocuments <= 4}>
            <b>Can not add any more documents</b>
          </Row>

          <Row>
            <Col>
              <Button hidden={numDocuments > 4} variant="success" onClick={() => setNumDocuments(numDocuments + 1)}>
                Add New Document
              </Button>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmApplication}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditApplication} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Application to <i>{currentProgramName}</i>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={6}>
              <b>Are you currently enrolled in other uncompleted certifications sponsored by the Cybersecurity Center? </b>
            </Col>
            <Col>
              <Form.Control
                onChange={(e) => setCurrentAppUncomcert(e.target.value)}
                required
                value={currentAppUncomcert}
                id="appucomcert"
                as="textarea"
                isInvalid={error.program_name}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <b>Have you completed any cybersecurity industry certifications via the Cybersecurity Center? </b>
            </Col>
            <Col>
              <Form.Control
                onChange={(e) => setCurrentAppCert(e.target.value)}
                required
                value={currentAppCert}
                id="appcert"
                as="textarea"
                isInvalid={error.program_description}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <b>Purpose Statement: </b>
            </Col>
            <Col>
              <Form.Control
                onChange={(e) => setCurrentAppPurpose(e.target.value)}
                required
                value={currentAppPurpose}
                id="apppurp"
                as="textarea"
                isInvalid={error.program_description}
              />
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col>
              <b>Uploaded Documents: </b>
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col sm={6}>
              <b>Enter Document Type: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setDocType1(e.target.value);
                  }}
                  value={doc_type1}
                  id="fileType"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <b>Enter Link: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setLink1(e.target.value);
                  }}
                  value={link1}
                  id="fileUpload"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <br></br>

          <Row>
            <Col sm={6}>
              <b>Enter Document Type: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setDocType2(e.target.value);
                  }}
                  value={doc_type2}
                  id="fileType"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <b>Enter Link: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setLink2(e.target.value);
                  }}
                  value={link2}
                  id="fileUpload"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <br></br>

          <Row>
            <Col sm={6}>
              <b>Enter Document Type: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setDocType3(e.target.value);
                  }}
                  value={doc_type3}
                  id="fileType"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <b>Enter Link: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setLink3(e.target.value);
                  }}
                  value={link3}
                  id="fileUpload"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <br></br>

          <Row>
            <Col sm={6}>
              <b>Enter Document Type: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setDocType4(e.target.value);
                  }}
                  value={doc_type4}
                  id="fileType"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <b>Enter Link: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setLink4(e.target.value);
                  }}
                  value={link4}
                  id="fileUpload"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <br></br>

          <Row>
            <Col sm={6}>
              <b>Enter Document Type: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setDocType5(e.target.value);
                  }}
                  value={doc_type5}
                  id="fileType"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <b>Enter Link: </b>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  onChange={(e) => {
                    setLink5(e.target.value);
                  }}
                  value={link5}
                  id="fileUpload"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row hidden={true}>
            <b>Can not add any more documents</b>
          </Row>

          <Row>
            <Col>
              <Button hidden={true} variant="success" onClick={() => setNumDocuments(numDocuments + 1)}>
                Add New Document
              </Button>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteApplication}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveApplication}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={deleteApplicationConfirmation} onHide={cancelDeleteApplication}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this Application? This action CANNOT be undone!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteApplication}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteApplication}>
            Delete
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
