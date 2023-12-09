const express = require("express");
const { Pool, Client } = require("pg");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require('../config/keys');
const bcrypt = require("bcryptjs");
const { pool } = require("../dbInstance");
// import {pool} from "../dbInstance";

/** Get All Event Data route created and implemented by:
 *  Billy Harkins
 *  
 *  SQL: SELECT
 */
router.get("/getAllEventData", async(req, res) => {

    pool.query("SELECT * FROM event", (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all event information")
        }
        res.status(200).json(result.rows);
    })
    
});

/** Get Event Info route created and implemented by:
 *  Billy Harkins
 *  
 *  SQL: SELECT
 */
router.get("/getEventInfo", async(req, res) => {
    const event_id = req.query.event_id;

    pool.query(`SELECT * FROM event WHERE event_id=${event_id}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json({message: "Error getting event details!"})
        }
        res.status(200).json(result.rows[0]);
    })
});

/** Get Attending Users route created and implemented by:
 *  Billy Harkins
 *  
 *  SQL: SELECT
 */
router.get("/getAttendingUsers", async(req, res) => {
    const event_id = req.query.event_id;

    pool.query(`SELECT uin, first_name, last_name, m_initial, email, discord, username, pass, user_type FROM attending_users WHERE event_id = ${event_id}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json({message: "Error getting attending user details!"})
        }
        res.status(200).json(result.rows);
    })
});

/** Get Signed Up Event route created and implemented by:
 *  Billy Harkins
 *  
 *  SQL: SELECT
 */
router.get("/getSignedUpEvent", async(req, res) => {
    const event_id = req.query.event_id;
    const uin = req.query.uin;

    pool.query(`SELECT * FROM event_tracking WHERE event_id = ${event_id} AND uin = ${uin}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json({message: "Error getting events user signed up for!"})
        }
        res.status(200).json(result.rows[0]);
    })
});

/** Create Event route created and implemented by:
 *  Billy Harkins
 *  
 *  SQL: INSERT
 */
router.post("/createEvent", async(req, res) => {
    const uin = req.body.uin;
    const program_num = req.body.program_num;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const time = req.body.time;
    const location = req.body.location;
    const eventType = req.body.eventType;
    const eventName = req.body.eventName;

    pool.query(`INSERT INTO event(uin, program_num, event_start_date, event_end_date, event_time, event_location, event_type, event_name) VALUES(${uin}, ${program_num}, '${startDate}', '${endDate}', '${time}', '${location}', '${eventType}', '${eventName}')`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json({message: "Error creating event!"});
        }
        res.status(200).json({message: "Success!"});
    })
});

/** Update Event route created and implemented by:
 *  Billy Harkins
 *  
 *  SQL: UPDATE
 */
router.post("/updateEvent", async(req, res) => {
    const program_num = req.body.program_num;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const time = req.body.time;
    const location = req.body.location;
    const eventType = req.body.eventType;
    const eventID = req.body.event_id;
    const eventName = req.body.eventName;

    pool.query(`UPDATE event SET program_num = ${program_num}, event_start_date = '${startDate}', event_end_date = '${endDate}', event_time = '${time}', event_location = '${location}', event_type = '${eventType}', event_name = '${eventName}' WHERE event_id = ${eventID}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json({message: "Error editing event!"});
        }
        res.status(200).json({message: "Success!"});
    })
});

/** Delete Event route created and implemented by:
 *  Billy Harkins
 *  
 *  SQL: DELETE
 */
router.post("/deleteEvent", async(req, res) => {
    const eventID = req.body.event_id;

    pool.query(`DELETE FROM event WHERE event_id = ${eventID}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json({message: "Error deleting event from main table!"});
        }
        res.status(200).json({message: "Success!"});
    })
});

/** Delete Event Bridge route created and implemented by:
 *  Billy Harkins
 *  
 *  SQL: DELETE
 */
router.post("/deleteEventBridge", async(req, res) => {
    const eventID = req.body.event_id;
    
    pool.query(`DELETE FROM event_tracking WHERE event_id = ${eventID}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json({message: "Error deleting event from bridge table!"});
        }
        res.status(200).json({message: "Success!"});
    })
})

/** Delete User From Event route created and implemented by:
 *  Billy Harkins
 *  
 *  SQL: DELETE
 */
router.post("/deleteUserFromEvent", async(req, res) =>{
    const event_id = req.body.event_id;
    const uin = req.body.uin;
    
    pool.query(`DELETE FROM event_tracking WHERE event_id = ${event_id} AND uin = ${uin}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json({message: "Error deleting user from event!"});
        }
        res.status(200).json({message: "Success!"});
    })
})

/** Add Student route created and implemented by:
 *  Billy Harkins
 *  
 *  SQL: INSERT
 */
router.post("/addStudent", async(req, res) => {
    const uin = req.body.uin;
    const eventID = req.body.event_id;

    pool.query(`INSERT INTO event_tracking(event_id, uin) VALUES (${eventID}, ${uin})`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json({message: "Error adding student!"});
        }
        res.status(200).json({message: "Success!"});
    })
});



module.exports = router;
