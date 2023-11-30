import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Container, Table, Spinner, Row, Col } from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";

function Management(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [allUserData, setAllUserData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    axios
        .get("/users/getAllUserData")
        .then((res) => {
            setTotalUsers(res.data.length);
            setAllUserData(res.data);
            setLoading(false);
        })
    

  }, []);  

  const adminTable = () => {
    const list = [];
    for(let k = 0; k < allUserData.length; k++) {
        if(allUserData[k].user_type != "Admin") {
            continue;
        }

        const temp = <tr key={k}>
                        <td>{allUserData[k].first_name} {allUserData[k].last_name}</td>
                    </tr>
        list.push(temp);
    }
    return list;
  }

  const userTable = () => {
    const list = [];
    for(let k = 0; k < allUserData.length; k++) {
        if(allUserData[k].user_type != "Student") {
            continue;
        }

        const temp = <tr key={k}>
                        <td>{allUserData[k].first_name} {allUserData[k].last_name}</td>
                    </tr>
        list.push(temp);
    }
    return list;
  }

  const createAccount = (type) => {
    history.push("/createAccount", {type: type})
  }

  return (
    <div className="Management">
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
                <div className="Admin Table">
                    <h2 className="display-5 text-center">Admins</h2>
                    <Table striped bordered hover className="text-center">
                        <thead>
                            <tr>
                                <th class="col-md-5">Name</th>
                                <th class="col-md-2">Edit</th>
                            </tr>
                        </thead>
                        <tbody>{adminTable()}</tbody>
                    </Table>
                </div>

                <br></br>
                <div className="User Table">
                    <h2 className="display-5 text-center">Users</h2>
                    <Table striped bordered hover className="text-center">
                        <thead>
                            <tr>
                                <th class="col-md-5">Name</th>
                                <th class="col-md-2">Edit</th>
                            </tr>
                        </thead>
                        <tbody>{userTable()}</tbody>
                    </Table>
                </div>

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
