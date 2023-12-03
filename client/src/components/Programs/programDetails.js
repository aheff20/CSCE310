import { useState, useEffect } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Container, Table, Spinner, Row, Col, CardGroup } from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";
import ProgramCard from './programCard';

function ProgramDetails(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [allUserData, setAllUserData] = useState([]);
  const [programInfo, setProgramInfo] = useState({});
  /* program_description, program_name, program_num [can ignore] */

  const programNum = useParams().programNum;


  useEffect(() => {
    axios.get("/programs/getProgramInfo", {
        params: {
            programNum: programNum
        }})
        .then((res) => {
            setProgramInfo(res.data);
            // get additional info only if admin
            if (props.auth.user.user_type == "Admin") {
              axios
                .get("/users/getAllUserData")
                .then((res) => {
                    setAllUserData(res.data);
                    setLoading(false);
                })
            }
            else setLoading(false);
        })
  }, []);

  const studentHandler = (userUIN) => {
    
  }

  const getTable = () => {
    const list = [];
    for(let k = 0; k < allUserData.length; k++) {
        
        if(allUserData[k].user_type == "Admin") {
            continue;
        }
        

        const temp = <tr key={k}>
                        <td>{allUserData[k].uin}</td>
                        <td>{allUserData[k].first_name} {allUserData[k].m_initial}. {allUserData[k].last_name}</td>
                        <td>{allUserData[k].email}</td>
                        <td>{allUserData[k].username}</td>
                        <td>{allUserData[k].discord}</td>
                        <td>
                            <Button variant="success btn-sm" onClick={() => studentHandler(allUserData[k].uin)}>
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
      <Container>
        {loading ? (
          <center>
            {" "}
            <Spinner animation="border" />{" "}
          </center>
        ) : (
          <React.Fragment>
            <br></br>
            <h2 className="display-5 text-center">{programInfo.program_name}</h2>
            <p className="text-center">{programInfo.program_description}</p>

            {props.auth.user.user_type == "Admin" ? (
                // Return a table with all students information who are in this program (programNum)
                // Each row in the table should be able to view more details in a modal to see more details/edit students
                <React.Fragment>
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
                                      <th className="col-md-1">Edit?</th>
                                  </tr>
                              </thead>
                              <tbody>{getTable()}</tbody>
                          </Table>
                          <br></br>
                  </div>
                </React.Fragment>
            ) : (
                // If the user is a student, they should have buttons to add new certifiates/classes/internships to the program
                // Allow the user to see their progress in the program
                <></>


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
