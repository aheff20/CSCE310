import React from 'react';
import { Button, Card } from "react-bootstrap";

const EventCard = (props) => {
    const {isAdmin, eventData, eventDetailsHandler} = props;

    return(
        <div className='event-card'>
            <Card
                border={"secondary"}
                style={{borderWidth: "5px", width:"20rem"}}
                className="p-3 m-4 rounded shadow"
            >
                <Card.Body>
                    <Card.Title>
                        <h3 className="display-6 text-center">{eventData.event_type}</h3>
                    </Card.Title>
                </Card.Body>

                <p>Start Date: {eventData.event_start_date}</p>
                <p>End Date: {eventData.event_end_date}</p>
                <p>Time: {eventData.event_time}</p>
                <p>Location: {eventData.event_location}</p>

                {isAdmin ? (
                    <React.Fragment>
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={() => eventDetailsHandler(eventData.event_id)}>
                            Event Details
                        </Button>
                    </React.Fragment>
                    ) : (
                    <Button variant="success btn-sm">
                        Sign Up
                    </Button>
                )}
            </Card>
        </div>
    );
};

export default EventCard;