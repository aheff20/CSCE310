const express = require("express");
const { Pool, Client } = require("pg");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require('../config/keys');
const bcrypt = require("bcryptjs");
const { pool } = require("../dbInstance");
// import {pool} from "../dbInstance";

router.get("/getAllProgramData", async(req, res) => {

    pool.query("SELECT * FROM programs", (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all program information")
        }
        res.status(200).json(result.rows);
    })
    
});

module.exports = router;
