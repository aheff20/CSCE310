const express = require("express");
const { Pool, Client } = require("pg");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require('../config/keys');
const bcrypt = require("bcryptjs");
const { pool } = require("../dbInstance");
// import {pool} from "../dbInstance";

/** Get all Class route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL:
 *      * select
 */
router.get("/getAllClassData", async(req, res) => {

    pool.query("SELECT * FROM classes", (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all event information")
        }
        res.status(200).json(result.rows);
    })
    
});

/** Get all Class route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL:
 *      * select
 */
router.get("/getAllInternshipData", async(req, res) => {

    pool.query("SELECT * FROM internship", (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all event information")
        }
        res.status(200).json(result.rows);
    })
    
});

/** Get all Class route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL:
 *      * select
 */
router.get("/getAllCertificateData", async(req, res) => {

    pool.query("SELECT * FROM certification", (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all event information")
        }
        res.status(200).json(result.rows);
    })
    
});


module.exports = router;