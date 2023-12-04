import { useState, useEffect } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Container, Table, Spinner, Row, Col, CardGroup } from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";
import EventCard from './eventCard';

function EventDetails(props) {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [allUserData, setAllUserData] = useState([]);
    const [eventInfo, setEventInfo] = useState({});
    const [attendingUsersAmount, setAttendingUsersAmount] = useState("");
    const [attendingUsers, setAttendingUsers] = useState([]);
  
    const event_id = useParams().event_id;
  
    useEffect(() => {
        Promise.all([
            axios.get("/events/getEventInfo", {
                params: {
                    event_id: event_id
                }}),
            axios.get("/events/getAttendingUsers", {
                params: {
                    event_id: event_id
                }})
        ])
        .then(([res1, res2]) => {
            setEventInfo(res1.data);
            setAttendingUsers([res2.data]);
            setAttendingUsersAmount([res2.data].length);
            setLoading(false);
        });
    }, []);

    const getTable = () => {
        const list = [];
        for(let k = 0; k < attendingUsers.length; k++) {
            const temp = <tr key={k}>
                            <td>{attendingUsers[k].uin}</td>
                            <td>{attendingUsers[k].first_name} {attendingUsers[k].m_initial}. {attendingUsers[k].last_name}</td>
                            <td>{attendingUsers[k].email}</td>
                            <td>{attendingUsers[k].username}</td>
                            <td>{attendingUsers[k].discord}</td>
                            <td>
                                <Button variant="danger btn-sm">
                                    Remove
                                </Button>
                            </td>
                        </tr>
            list.push(temp);
        }
        return list;
    }
  
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
              <br></br>
              <h2 className="display-5 text-center">Event {event_id} Details</h2>

                <p>Start Date: {eventInfo.event_start_date}</p>
                <p>End Date: {eventInfo.event_end_date}</p>
                <p>Time: {eventInfo.event_time}</p>
                <p>Location: {eventInfo.event_location}</p>
                <p>Type: {eventInfo.event_type}</p>
                <p>Number of Students attending: {attendingUsersAmount}</p>

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