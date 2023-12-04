import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Container, Table, Spinner, Row, Col, CardGroup } from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";
import EventCard from './eventCard';

function Events(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [allEventData, setAllEventData] = useState([]);
  
  useEffect(() => {
    axios
      .get("/events/getAllEventData")
      .then((res) => {
        setAllEventData(res.data);
        setLoading(false);
      });

  }, []);  

  const handleCreateNewEvent = () => {
    console.log(`Creating new event`);
  }

  const eventDetailsHandler = (event_id) => {
    history.push("/events/" + event_id);
  }

  const eventsForUser = allEventData.map((event) => (
    <EventCard
      key={event.event_id}
      isAdmin={props.auth.user.user_type === "Admin"}
      eventData={event} 
      eventDetailsHandler = {() => eventDetailsHandler(event.event_id)}
    />
  ))

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
