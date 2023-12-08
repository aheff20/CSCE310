/**
View created and implemented by:
    Billy Harkins

*/

import { useState, useEffect } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Container, Table, Spinner, Row, Col, CardGroup, Modal } from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";
import EventCard from './eventCard';

/**
    Events Page:
      * Admins can create new events
      * Students can sign up for events they haven't already signed up for
      * All users can view general information about each event.
*/
function Events(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [allEventData, setAllEventData] = useState([]);
  const [allProgramData, setAllProgramData] = useState([]);
  const [currentUserUIN, setCurrentUserUIN] = useState(props.auth.user.uin);

  const [assignedProgram, setAssignedProgram] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [eventName, setEventName] = useState("");

  const [showEventCreate, setshowEventCreate] = useState(false);
  
  /**
    Grabs information on all events and programs to ensure the page is correctly populated
  */
  useEffect(() => {
    Promise.all([
      axios.get("/events/getAllEventData"),
      axios.get("/programs/getAllProgramData")
  ])
  .then(([res1, res2]) => {
      setAllEventData(res1.data);
      setAllProgramData(res2.data);
      setLoading(false);
  });
  }, []);  

  /**
     Makes the event creation modal visible
  */
  const handleCreateNewEvent = () => {
    setshowEventCreate(true);
  }

  /**
     Makes the event creation modal invisible
  */
  const handleCloseCreateEvent = () => {
    setshowEventCreate(false);
  }

  /**
     Creates a new event by inserting it into the database. Upon completion, the page refreshes to display the new event.
  */
  const handleCreate = () => {
    axios
    .post("events/createEvent", {
      uin: currentUserUIN,
      program_num: assignedProgram,
      startDate: startDate,
      endDate: endDate,
      time: time,
      eventType: eventType,
      location: location,
      eventName: eventName
    })
    .then((res) => {
        history.go(0);
        setshowEventCreate(false);
    })
  }

  /**
     Handles navigation between this page and the dynamically generated event details page
  */
  const eventDetailsHandler = (event_id) => {
    history.push("/events/" + event_id);
  }

  /**
     Creates a list of EventCard components using the previously queried event information from the database.
     One component is created for each event and contains general event information.
  */
  const eventsForUser = allEventData.map((event) => (
    <EventCard
      key={event.event_id}
      isAdmin={props.auth.user.user_type === "Admin"}
      userUIN={props.auth.user.uin}
      eventData={event} 
      eventDetailsHandler = {() => eventDetailsHandler(event.event_id)}
    />
  ))

  /**
     Creates a list of option components using the previously queried program information from the database.
     This is used to populate a dropdown menu that allows admins to select which program the event is associated with.
  */
  const programOptions = allProgramData.map((program) => (
    <option value={program.program_num}>{program.program_name}</option>
  ))

  /**
     React html code to return for the page view. The modal is shown whenever showEventCreate is set to true. 
  */
  return (
    <div className="Events">
      <Container>
        {loading ? (
            <center>
                {" "}
                <Spinner animation="border" />{" "}
            </center>
        ):(
            <React.Fragment>

            <Modal show={showEventCreate} onHide={handleCloseCreateEvent}>
              <Modal.Header closeButton>
              <Modal.Title>
                Create New Event
              </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                
              <Row>
                  <Col sm={4}>
                    <b>Event Name:</b>
                  </Col>
                  <Col>
                    <Form.Group>
                            <Form.Control
                            onChange={(e) => setEventName(e.target.value)}
                            value={eventName}
                            id="eventName"
                            type="text"
                            />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                    <Col sm={4}>
                        <b>Program: </b>
                    </Col>
                    <Col>
                      <Form.Select
                            aria-label="Assigned Program"
                            value={assignedProgram}
                            onChange={(e) => {
                              setAssignedProgram(e.target.value); }}
                            >
                            {programOptions}
                      </Form.Select>
                    </Col>
                </Row>

                <Row>
                  <Col sm={4}>
                    <b>Start Date:</b>
                  </Col>
                  <Col>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="date"
                      aria-label="Start Date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                      }}
                      >
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm={4}>
                    <b>End Date:</b>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="date"
                        aria-label="End Date"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                        }}
                        >
                        </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm={4}>
                    <b>Time:</b>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="time"
                        aria-label="Time"
                        value={time}
                        onChange={(e) => {
                          setTime(e.target.value);
                        }}
                        >
                        </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm={4}>
                    <b>Location:</b>
                  </Col>
                  <Col>
                    <Form.Group>
                            <Form.Control
                            onChange={(e) => setLocation(e.target.value)}
                            value={location}
                            id="location"
                            type="text"
                            />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm={4}>
                    <b>Event Type:</b>
                  </Col>
                  <Col>
                    <Form.Group>
                            <Form.Control
                            onChange={(e) => setEventType(e.target.value)}
                            value={eventType}
                            id="EventType"
                            type="text"
                            />
                    </Form.Group>
                  </Col>
                </Row>
                <br></br>
                <Row>
                    <Button variant="success btn-lg" onClick={handleCreate}>
                        Create Event
                    </Button>
                </Row>
                <br></br>
                </Modal.Body>
            </Modal>

                <br></br>
                <h2 className="display-5 text-center">Event Data</h2>
                {props.auth.user.user_type === "Admin" &&
                  <center>
                    <Button
                      variant="primary btn-lg"
                      type="submit"
                      onClick={() => handleCreateNewEvent()}>
                      Create New Event
                    </Button>
                  </center>
                }

                <br></br>
                <CardGroup>{eventsForUser}</CardGroup>
                
            </React.Fragment>
        )}
        </Container>
        </div>
      
  );
}

Events.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Events);
