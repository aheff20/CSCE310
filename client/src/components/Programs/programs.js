import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Container, Table, Spinner, Row, Col, CardGroup } from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";
import ProgramCard from './programCard';

function Programs(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [allUserData, setAllUserData] = useState([]);
  const [allProgramData, setAllProgramData] = useState([]);


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
  }
  const handleEditProgram = (programNum) => {
    console.log(`Editing program ${programNum}`);
  };

  const applyToProgram = (programNum) => {

  }

  const deleteProgramHandler = (programNum) => {

  }

  const programDetailsHandler = (programNum) => {
    history.push("/programs/" + programNum);

  }

  const programsForUser = allProgramData.map((program) => (
                            <ProgramCard
                              key={program.program_num}
                              isAdmin={props.auth.user.user_type === "Admin"}
                              programData={program}
                              editProgramHandler={() => handleEditProgram(program.program_num)}
                              applyToProgram={() => applyToProgram(program.program_num)} 
                              deleteProgramHandler={() => deleteProgramHandler(program.program_num)}
                              programDetailsHandler={() => programDetailsHandler(program.program_num)} />
                          ))

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
