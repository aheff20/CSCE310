const express = require("express");
const { Pool, Client } = require("pg");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require('../config/keys');
const bcrypt = require("bcryptjs");
const { pool } = require("../dbInstance");
// import {pool} from "../dbInstance";

/////
//search

/** Get all Class route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: select
 */
router.get("/getAllClassData", async(req, res) => {

    pool.query("SELECT * FROM classes", (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all event information");
        }
        res.status(200).json(result.rows);
    })
    
});

/** Get all Class route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: select
 */
router.get("/getAllInternshipData", async(req, res) => {

    pool.query("SELECT * FROM internship", (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all event information");
        }
        res.status(200).json(result.rows);
    })
    
});

/** Get all Class route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: select
 */
router.get("/getAllCertificateData", async(req, res) => {

    pool.query("SELECT * FROM certification", (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all event information");
        }
        res.status(200).json(result.rows);
    })
    
});

/** Get last class matching name route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: select
 */
router.get("/lastClassMatch", async(req, res) => {
    const class_name = req.query.class_name;
    pool.query(`SELECT * FROM classes WHERE class_name='${class_name}' ORDER BY class_id DESC LIMIT 1`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting last class");
        }
        //console.log(result.rows);
        res.status(200).json(result.rows[0]);
    })
})

/** Get last internship matching name route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: select
 */
router.get("/lastInternshipMatch", async(req, res) => {
    const internship_name = req.query.internship_name;
    pool.query(`SELECT * FROM internship WHERE company_name='${internship_name}' ORDER BY intern_id DESC LIMIT 1`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting last class");
        }
        //console.log(result.rows);
        res.status(200).json(result.rows[0]);
    })
})

/** Get last certificate matching name route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: select
 */
router.get("/lastCertificateMatch", async(req, res) => {
    const cert_name = req.query.cert_name;
    pool.query(`SELECT * FROM certification WHERE cert_name='${cert_name}' ORDER BY cert_id DESC LIMIT 1`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting last class");
        }
        //console.log(result.rows);
        res.status(200).json(result.rows[0]);
    })
})

/////
//create

/** Create Class route created and implemented by:
 *  Logan Carbo
 *  
 *  SQL: insert
 */
router.post("/createClass", async(req, res) => {
    let name = req.body.name;
    let description = req.body.description;
    let classType = req.body.classType;

    pool.query(`INSERT INTO classes(class_name, class_description, class_type) VALUES ('${name}','${description}','${classType}')`, (err, result) => {
        if(err) {
            console.log(err);
            res.status(400).json({message: "Error creating class!"});
        }
        res.status(200).json({message: "Success!"});
    })
});

/** Create Class Enrollment route created and implemented by:
 *  Logan Carbo
 *  
 *  SQL: insert
 */
router.post("/createClassEnrollment", async(req, res) => {
    let uin = req.body.uin;
    let class_id = req.body.class_id;
    let class_status = req.body.class_status;
    let semester = req.body.semester;
    let year = req.body.year;
    // uin    | class_id | class_status | semester |  yr
    console.log(uin, class_id, class_status, semester, year);

    pool.query(`INSERT INTO class_enrollment(uin, class_id, class_status, semester, yr) VALUES (${uin},${class_id},'${class_status}','${semester}',${year})`, (err, result) => {
        if(err) {
            console.log(err);
            res.status(400).json({message: "Error creating class!"});
        }
        res.status(200).json({message: "Success!"});
    })
});

/** Create Internship route created and implemented by:
 *  Logan Carbo
 *  
 *  SQL: insert
 */
router.post("/createInternship", async(req, res) => {
    let name = req.query.name;
    let description = req.query.description;
    let isGov = req.query.isGov;
    let location = req.query.location;

    pool.query(`INSERT INTO internship(company_name, intern_description, is_gov, location) VALUES ('${name}','${description}',${isGov},'${location}')`, (err, result) => {
        if(err) {
            console.log(err);
            res.status(400).json({message: "Error creating class!"});
        }
        res.status(200).json({message: "Success!"});
    })
});

/** Create Internship Application route created and implemented by:
 *  Logan Carbo
 *  
 *  SQL: insert
 */
router.post("/createInternshipApplication", async(req, res) => {
    let uin = req.body.uin;
    let intern_id = req.body.class_id;
    let intern_status = req.body.class_status;
    let year = req.body.year;
    // uin | intern_id | intern_status | yr
    console.log(uin, intern_id, intern_status, year);

    pool.query(`INSERT INTO intern_app(uin, intern_id, intern_status, yr) VALUES (${uin},${intern_id},'${intern_status}',${year})`, (err, result) => {
        if(err) {
            console.log(err);
            res.status(400).json({message: "Error creating class!"});
        }
        res.status(200).json({message: "Success!"});
    })
});

/** Create Certification route created and implemented by:
 *  Logan Carbo
 *  
 *  SQL: insert
 */
router.post("/createCertification", async(req, res) => {
    let name = req.body.name;
    let description = req.body.description;
    let certLevel = req.body.Level;

    pool.query(`INSERT INTO certification(cert_name, cert_description, cert_level) VALUES ('${name}','${description}','${certLevel}')`, (err, result) => {
        if(err) {
            console.log(err);
            res.status(400).json({message: "Error creating class!"});
        }
        res.status(200).json({message: "Success!"});
    })
});

/** Create Certification Enrollment route created and implemented by:
 *  Logan Carbo
 *  
 *  SQL: insert
 */
router.post("/createCertificationEnrollment", async(req, res) => {
    let uin = req.body.uin;
    let cert_id = req.body.class_id;
    let cert_status = req.body.class_status;
    let training_status = req.body.training_status;
    let program_num = req.body.program_num;
    let year = req.body.year;
    // uin | cert_id | cert_status | training_status | program_num | semester | yr
    console.log(uin, cert_id, cert_status, training_status, program_num, semester, year);

    pool.query(`INSERT INTO cert_enrollment(uin, cert_id, cert_status, training_status, program_num, semester, yr) VALUES (${uin},${cert_id},'${cert_status}','${training_status}',${program_num},${year})`, (err, result) => {
        if(err) {
            console.log(err);
            res.status(400).json({message: "Error creating class!"});
        }
        res.status(200).json({message: "Success!"});
    })
});

/////
//update

/////
//delete


module.exports = router;