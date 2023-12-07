import React from 'react';
import { Button, Card } from "react-bootstrap";

const ProgramCard = (props) => {
    const { isAdmin, programData, editProgramHandler, applyToProgram, accessProgramHandler, programDetailsHandler } = props;
    const accessButtonText = programData.active ? "Close Program" : "Reopen Program";

    return (
        <div className="program-card">
            <Card
                border={"secondary"}
                style={{ borderWidth: "5px", width: "20rem" }}
                className="p-3 m-4 rounded shadow"
            >
                <Card.Body>
                    <Card.Title>
                        <h3 className="display-6 text-center">{programData.program_name}</h3>
                    </Card.Title>

                </Card.Body>

                <p>{programData.program_description}</p>

                {isAdmin ? (
                    <React.Fragment>
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={() => programDetailsHandler(programData.program_num)}>
                            Program Details
                        </Button>
                        <br></br>
                        <Button
                            variant="secondary"
                            type="submit"
                            onClick={() => editProgramHandler(programData.program_num)}>
                            Edit Program
                        </Button>
                        <br></br>
                        <Button
                            variant="danger"
                            type="submit"
                            onClick={() => accessProgramHandler(programData.program_num, programData.active)}>
                            {accessButtonText}
                        </Button>
                    </React.Fragment>

                ) : (
                    <Button
                        variant="success"
                        type="submit"
                        onClick={() => applyToProgram(programData.program_num)}>
                        Apply for Program!
                    </Button>
                )}
            </Card>
        </div>
    );
};

export default ProgramCard;