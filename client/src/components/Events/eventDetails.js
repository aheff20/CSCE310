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

/**
    Event Details Page:
      * Each page is associated with one specific event.
      * Admins can edit this page's event.
      * Admins can delete this page's event.
      * Admins can view which students and how many students are signed up for this page's event.
      * Admins can edit the attendance of this page's event by removing students who have signed up.
*/
function EventDetails(props) {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [allProgramData, setAllProgramData] = useState([]);
    const [attendingUsersAmount, setAttendingUsersAmount] = useState("");
    const [attendingUsers, setAttendingUsers] = useState([]);
    const [eventData, setEventData] = useState();

    const [showEditEvent, setShowEditEvent] = useState(false);
    const [assignedProgram, setAssignedProgram] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [time, setTime] = useState("");
    const [eventType, setEventType] = useState("");
    const [location, setLocation] = useState("");
    const [eventName, setEventName] = useState("");
    const [programName, setProgramName] = useState("");
  
    const event_id = useParams().event_id;

    /**
      Grab information on this page's event, its attending users, and all programs to ensure the page is correctly populated
    */
    useEffect(() => {
        Promise.all([
            axios.get("/events/getEventInfo", {
                params: {
                    event_id: event_id
                }}),
            axios.get("/events/getAttendingUsers", {
                params: {
                    event_id: event_id
                }}),
            axios.get("/programs/getAllProgramData")
        ])
        .then(([res1, res2, res3]) => {
            setAssignedProgram(res1.data.program_num);
            setStartDate(res1.data.event_start_date.substring(0,10));
            setEndDate(res1.data.event_end_date.substring(0,10));
            setTime(res1.data.event_time);
            setLocation(res1.data.event_location);
            setEventType(res1.data.event_type);
            setEventName(res1.data.event_name);
            setEventData(res1.data);

            findProgramName(res1.data.program_num);

            setAttendingUsers(res2.data);
            if(res2.data){
              setAttendingUsersAmount(res2.data.length);
            }
            else{
              setAttendingUsersAmount(0);
            }
            setAllProgramData(res3.data);

            setLoading(false);
        });
    }, []);

    /**
      Removes a given user from the bridge table in the database, 
      effectively making it so that they are not signed up for this page's event.
      
      Refreshes page when action is complete.
    */
    const removeUserFromEvent = (uin) => {
      axios.post("/events/deleteUserFromEvent", {
        uin: uin,
        event_id: event_id
      })
      .then((res) => {
        history.go(0);
      })
    }

    /**
      Dynamically creates the body of the table that shows all students that are signed up for this page's event
    */
    const getTable = () => {
        const list = [];
        if(!attendingUsers[0]){
          return list;
        }
        for(let k = 0; k < attendingUsers.length; k++) {
            const temp = <tr key={k}>
                            <td>{attendingUsers[k].uin}</td>
                            <td>{attendingUsers[k].first_name} {attendingUsers[k].m_initial}. {attendingUsers[k].last_name}</td>
                            <td>{attendingUsers[k].email}</td>
                            <td>{attendingUsers[k].username}</td>
                            <td>{attendingUsers[k].discord}</td>
                            <td>
                                <Button 
                                variant="danger btn-sm"
                                onClick={() => removeUserFromEvent(attendingUsers[k].uin)}>
                                    Remove
                                </Button>
                            </td>
                        </tr>
            list.push(temp);
        }
        return list;
    }

    /**
      Makes the event editing modal visible
    */
    const showEdit = () => {
      setShowEditEvent(true);
    }

    /**
      Makes the event editing modal invisible
    */
    const closeEdit = () => {
      setShowEditEvent(false);
    }

    /**
      Edits the information associated with this page's event in the database. Refreshes page when action is complete.
    */
    const editEventHandler = () => {
      axios
    .post("/events/updateEvent", {
      program_num: assignedProgram,
      startDate: startDate,
      endDate: endDate,
      time: time,
      eventType: eventType,
      location: location,
      event_id: event_id,
      eventName: eventName
    })
    .then((res) => {
        history.go(0);
        setShowEditEvent(false);
    })
    }

    /**
      Confirms with the user whether or not they want to delete this page's event.
      If user confirms, deletes event from database and returns to Events Page.
    */
    const deleteEventHandler = () => {
      let confirm = window.confirm("Are you sure you want to remove " + eventData.event_name + "? This action CANNOT be undone.");
      if(!confirm) {
        return;
      }

      Promise.all([
        axios.post("/events/deleteEvent", {event_id: event_id}),
        axios.post("/events/deleteEventBridge", {event_id: event_id})
      ])
      .then((res) => {
        history.go(-1);
      })
    }

  /**
    Queries the database and sets the programName constant to 
    the name of the program that the page's event is associated with 
  */
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
  
  /**
    Creates a list of option components using the previously queried program information from the database.
    This is used to populate a dropdown menu that allows admins to edit which program the page's event is associated with.
  */
   const programOptions = allProgramData.map((program) => (
    <option value={program.program_num}>{program.program_name}</option>
  ))
  
    /**
      React html code to return for the page view. The modal is shown whenever showEditEvent is set to true. 
    */
    return (
      <div className="Events">
        <Container>
          {loading ? (
            <center>
              {" "}
              <Spinner animation="border" />{" "}
            </center>
          ) : (
            <React.Fragment>

            <Modal show={showEditEvent} onHide={closeEdit}>
              <Modal.Header closeButton>
              <Modal.Title>
                Edit Event
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
                    <Button variant="success btn-lg" onClick={editEventHandler}>
                        Submit Changes
                    </Button>
                </Row>
                <br></br>
                </Modal.Body>
            </Modal>

              <br></br>
              <h2 className="display-5 text-center">{eventData.event_name} Details</h2>

                <p className="text-center">Associated Program: {programName}</p>
                <p className="text-center">Start Date: {eventData.event_start_date.substring(0,10)}</p>
                <p className="text-center">End Date: {eventData.event_end_date.substring(0,10)}</p>
                <p className="text-center">Time: {eventData.event_time}</p>
                <p className="text-center">Location: {eventData.event_location}</p>
                <p className="text-center">Type: {eventData.event_type}</p>
                <p className="text-center">Number of Students attending: {attendingUsersAmount}</p>

                <center>
                <Button variant="warning btn-lg" onClick={showEdit}>
                        Edit Event
                </Button>

                <Button variant="danger btn-lg" onClick={deleteEventHandler}>
                        Delete Event
                </Button>
                </center>

                <h2 className="display-5 text-center">Students Attending This Event</h2>
  
              {props.auth.user.user_type == "Admin" ? (
                  <React.Fragment>
                    <Table striped bordered hover className="text-center">
                                <thead>
                                    <tr>
                                        <th className="col-md-1">UIN</th>
                                        <th className="col-md-2">Name</th>
                                        <th className="col-md-2">Email</th>
                                        <th className="col-md-2">Username</th>
                                        <th className="col-md-2">Discord</th>
                                        <th className="col-md-1">Remove</th>
                                    </tr>
                                </thead>
                                <tbody>{getTable()}</tbody>
                    </Table>
                </React.Fragment>
  
              ) : (
                  <></>
              )}
            </React.Fragment>
          )}
        </Container>
      </div>
    );
  }
  
  EventDetails.propTypes = {
    auth: PropTypes.object.isRequired,
  };
  
  const mapStateToProps = (state) => ({
    auth: state.auth,
  });
  
  export default connect(mapStateToProps)(EventDetails);