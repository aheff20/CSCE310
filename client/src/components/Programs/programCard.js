import React from 'react';
import { Button } from "react-bootstrap";

const ProgramCard = (props) => {
    const { isAdmin, programData, editProgramHandler } = props;
    return (
        <div className="program-card">
            <h3>{programData.program_name}</h3>
            <p>{programData.program_description}</p>
            {isAdmin &&
                <Button
                    variant="secondary"
                    type="submit"
                    onClick={() => editProgramHandler(programData.program_num)}>
                    Edit Program
                </Button>
            }
        </div>
    );
};

export default ProgramCard;