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

module.exports = router;
