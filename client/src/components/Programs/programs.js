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
  const [currentProgramNum, setCurrentProgramNum] = useState([]);
  const [currentProgramName, setCurrentProgramName] = useState([]);
  const [currentProgramDescription, setCurrentProgramDescription] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [error, setError] = useState({});


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
    setShowCreate(true);
  }
  const handleConfirmCreate = () => {
    axios
      .post("programs/createProgram", {
        program_name: currentProgramName,
        program_description: currentProgramDescription,
      })
      .then((res) => {
        history.go(0);
        setShowCreate(false);
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
        setShowEdit(true);
      })
  };

  const applyToProgram = (programNum) => {

  }

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

  const handleDelete = (programNum) => {
    setDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    console.log(`Deleting program ${currentProgramNum}`);
    axios
      .post("/programs/deleteProgram", { program_num: currentProgramNum })
      .then((res) => {
        if (res.status === 201) {
          console.log(res.data)
          setError(res.data);
        } else {
          history.go(0);
          handleClose();
          setDeleteConfirmation(false);
        }
      })
  };

  const cancelDelete = () => {
    setDeleteConfirmation(false);
  };

  const programDetailsHandler = (programNum) => {
    history.push("/programs/" + programNum);

  }

  /**
     * Send updated user information to backend, refresh the page and close the modal
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
          setShowEdit(false);
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
    setShowEdit(false);
    setShowCreate(false);
  }

  const programsForUser = allProgramData.map((program) => (
    <ProgramCard
      key={program.program_num}
      isAdmin={props.auth.user.user_type === "Admin"}
      programData={program}
      editProgramHandler={() => handleEditProgram(program.program_num)}
      applyToProgram={() => applyToProgram(program.program_num)}
      accessProgramHandler={() => accessProgramHandler(program.program_num, program.active)}
      programDetailsHandler={() => programDetailsHandler(program.program_num)} />
  ))

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
              <Form.Control
                onChange={(e) => setCurrentProgramName(e.target.value)}
                required
                value={currentProgramName}
                id="pname"
                type="text"
                isInvalid={error.program_name}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <b>Program Description: </b>
            </Col>
            <Col>
              <Form.Control
                onChange={(e) => setCurrentProgramDescription(e.target.value)}
                required
                value={currentProgramDescription}
                id="pdesc"
                type="textarea"
                isInvalid={error.program_description}
              />
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

      <Modal show={showEdit} onHide={handleClose}>
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
              <Form.Control
                onChange={(e) => setCurrentProgramName(e.target.value)}
                required
                value={currentProgramName}
                id="pname"
                type="text"
                isInvalid={error.program_name}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <b>Program Description: </b>
            </Col>
            <Col>
              <Form.Control
                onChange={(e) => setCurrentProgramDescription(e.target.value)}
                required
                value={currentProgramDescription}
                id="pdesc"
                type="textarea"
                isInvalid={error.program_description}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
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

      <Modal show={deleteConfirmation} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Program</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the program? This action CANNOT be undone!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
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
