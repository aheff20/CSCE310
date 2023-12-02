import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Container, Table, Spinner, Row, Col, Modal} from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";

function Management(props) {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [allUserData, setAllUserData] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    
    const [show, setShow] = useState(false);
    const [currentUserUIN, setCurrentUserUIN] = useState();
    const [currentUserType, setCurrentUserType] = useState("");
    const [currentUserFName, setCurrentUserFName] = useState("");
    const [currentUserLName, setCurrentUserLName] = useState("");
    const [currentUserMInitial, setCurrentUserMInitial] = useState("");
    const [currentUserEmail, setCurrentUserEmail] = useState("");
    const [currentUserUsername, setCurrentUserUsername] = useState("");
    const [currentUserDiscord, setCurrentUserDiscord] = useState("");

    useEffect(() => {
        axios
            .get("/users/getAllUserData")
            .then((res) => {
                setTotalUsers(res.data.length);
                setAllUserData(res.data);
                setLoading(false);
            })
    }, []);

    const getTable = (tableKey) => {
        const list = [];
        for(let k = 0; k < allUserData.length; k++) {
            if(allUserData[k].user_type != tableKey) {
                continue;
            }

            const temp = <tr key={k}>
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

    const createAccount = (type) => {
        history.push("/createAccount", {type: type})
    }

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
                setShow(true);
            })        
    }

    const handleClose = () => {
        setCurrentUserUIN();
        setCurrentUserType("");
        setCurrentUserFName("");
        setCurrentUserLName("");
        setCurrentUserMInitial("");
        setCurrentUserEmail("");
        setCurrentUserUsername("");
        setCurrentUserDiscord("");
        setShow(false);
    }

    const handleSave = () => {

    }


    return (
        <div className="Management">
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>
                    Editing: <i>{currentUserFName} {currentUserMInitial} {currentUserLName}</i>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
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
