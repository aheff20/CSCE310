import React, { useState } from 'react';
import { Button, Card } from "react-bootstrap";
import axios from "axios";

const EventCard = (props) => {
    const {isAdmin, userUIN, eventData, eventDetailsHandler} = props;

    const [signedUp, setSignedUp] = useState(false);
    const [programName, setProgramName] = useState("");

    const handleAddStudent = () => {
        axios
        .post("/events/addStudent", {
        uin: userUIN,
        event_id: eventData.event_id
        })
        .then((res) => {
            history.go(0);
        })
    }

    const eventSignedUp = (eventData) => {
        axios
        .get("/events/getSignedUpEvent", {
            params: {
                event_id: eventData.event_id,
                uin: userUIN
            }})
        .then((res) =>{
          if(res.data){
            setSignedUp(true);
          }
          else{
            setSignedUp(false);
          }
        })
      }
      
      const findProgramName = (program_num) => {
        axios
        .get("/programs/getProgramInfo", {
            params: {
              programNum: program_num
            }
          })
        .then((res) => {
            setProgramName(res.data.program_name);
        })
    }

      if(isAdmin == false){
        eventSignedUp(eventData);
      }

      findProgramName(eventData.program_num);

    return(
        <div className='event-card'>
            <Card
                border={"secondary"}
                style={{borderWidth: "5px", width:"20rem"}}
                className="p-3 m-4 rounded shadow"
            >
                <Card.Body>
                    <Card.Title>
                        <h3 className="display-6 text-center">{eventData.event_name}</h3>
                    </Card.Title>
                </Card.Body>

                <p>Associated Program: {programName}</p>
                <p>Event Type: {eventData.event_type}</p>
                <p>Start Date: {eventData.event_start_date.substring(0,10)}</p>
                <p>End Date: {eventData.event_end_date.substring(0,10)}</p>
                <p>Time: {eventData.event_time}</p>
                <p>Location: {eventData.event_location}</p>

                {isAdmin &&
                    <React.Fragment>
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={() => eventDetailsHandler(eventData.event_id)}>
                            Event Details
                        </Button>
                    </React.Fragment>
                }
                {!isAdmin && !signedUp &&
                    <Button 
                    variant="success btn-sm"
                    onClick={() => handleAddStudent()}
                    >
                        Sign Up
                    </Button>
                }                
                {!isAdmin && signedUp &&
                <b>You signed up!</b>
                }
            </Card>
        </div>
    );
};

export default EventCard;