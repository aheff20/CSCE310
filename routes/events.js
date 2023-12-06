const express = require("express");
const { Pool, Client } = require("pg");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require('../config/keys');
const bcrypt = require("bcryptjs");
const { pool } = require("../dbInstance");
// import {pool} from "../dbInstance";

router.get("/getAllEventData", async(req, res) => {

    pool.query("SELECT * FROM event", (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all event information")
        }
        res.status(200).json(result.rows);
    })
    
});

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

router.get("/getAttendingUsers", async(req, res) => {
    const event_id = req.query.event_id;

    // SELECT U.* FROM event E JOIN event_tracking ET ON E.event_id = ET.event_ID JOIN users U on ET.uin = U.uin WHERE E.event_id = 1;
    pool.query(`SELECT U.* FROM event E JOIN event_tracking ET ON E.event_id = ET.event_ID JOIN users U on ET.uin = U.uin WHERE E.event_id = ${event_id}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json({message: "Error getting attending user details!"})
        }
        res.status(200).json(result.rows[0]);
    })
});

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

router.post("/createEvent", async(req, res) => {
    const uin = req.body.uin;
    const program_num = req.body.program_num;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const time = req.body.time;
    const location = req.body.location;
    const eventType = req.body.eventType;

    pool.query(`INSERT INTO event(uin, program_num, event_start_date, event_end_date, event_time, event_location, event_type) VALUES(${uin}, ${program_num}, '${startDate}', '${endDate}', '${time}', '${location}', '${eventType}')`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json({message: "Error creating event!"});
        }
        res.status(200).json({message: "Success!"});
    })
});

router.post("/updateEvent", async(req, res) => {
    const program_num = req.body.program_num;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const time = req.body.time;
    const location = req.body.location;
    const eventType = req.body.eventType;
    const eventID = req.body.event_id;

    pool.query(`UPDATE event SET program_num = ${program_num}, event_start_date = '${startDate}', event_end_date = '${endDate}', event_time = '${time}', event_location = '${location}', event_type = '${eventType}' WHERE event_id = ${eventID}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json({message: "Error editing event!"});
        }
        res.status(200).json({message: "Success!"});
    })
});

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
