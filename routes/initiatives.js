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

/** Get single Class route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: select
 */
router.get("/getClass", async(req, res) => {

    const class_id = req.query.class_id;
    pool.query(`SELECT * FROM classes WHERE class_id=${class_id}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all event information");
        }
        res.status(200).json(result.rows[0]);
    })
    
});

/** Get single Internship route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: select
 */
router.get("/getInternship", async(req, res) => {

    const intern_id = req.query.intern_id;
    pool.query(`SELECT * FROM internship WHERE intern_id=${intern_id}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all event information");
        }
        res.status(200).json(result.rows[0]);
    })
    
});

/** Get single Certification route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: select
 */
router.get("/getCertification", async(req, res) => {

    const cert_id = req.query.cert_id;
    pool.query(`SELECT * FROM certification WHERE cert_id=${cert_id}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all event information");
        }
        res.status(200).json(result.rows[0]);
    })
    
});

/** Get single Class Enrollment route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: select
 */
router.get("/getClassEnrollment", async(req, res) => {

    const ce_num = req.query.ce_num;
    pool.query(`SELECT * FROM class_enrollment WHERE ce_num=${ce_num}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all event information");
        }
        res.status(200).json(result.rows[0]);
    })
    
});

/** Get single Internship Application route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: select
 */
router.get("/getInternshipApplication", async(req, res) => {

    const ia_num = req.query.ia_num;
    pool.query(`SELECT * FROM intern_app WHERE ia_num=${ia_num}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all event information");
        }
        res.status(200).json(result.rows[0]);
    })
    
});

/** Get single Certification Enrollment route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: select
 */
router.get("/getCertificationEnrollment", async(req, res) => {

    const certe_num = req.query.certe_num;
    pool.query(`SELECT * FROM cert_enrollment WHERE certe_num=${certe_num}`, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all event information");
        }
        res.status(200).json(result.rows[0]);
    })
    
});

/** Get all user_class data route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: select
 */
router.get("/getAllUserClassData", async(req, res) => {

    pool.query("SELECT * FROM user_classes", (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all event information");
        }
        res.status(200).json(result.rows);
    })
    
});

/** Get all user_internships data route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: select
 */
router.get("/getAllUserInternshipData", async(req, res) => {

    pool.query("SELECT * FROM user_internships", (err, result) => {
        if(err){
            console.log(err);
            res.status(400).json("Error getting all event information");
        }
        res.status(200).json(result.rows);
    })
    
});

/** Get all user_certificates data route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: select
 */
router.get("/getAllUserCertificateData", async(req, res) => {

    pool.query("SELECT * FROM user_certifications", (err, result) => {
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
    let name = req.body.name;
    let description = req.body.description;
    let isGov = req.body.isGov === "Yes";
    let location = req.body.location;
    console.log(name, description, isGov, location);

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
    let intern_id = req.body.intern_id;
    let intern_status = req.body.intern_status;
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
    //123456789 '1' 'testing' 'testing' '12' 2023
    let uin = req.body.uin;
    let cert_id = req.body.cert_id;
    let cert_status = req.body.cert_status;
    let training_status = req.body.training_status;
    let program_num = req.body.program_num;
    let semester = req.body.semester;
    let year = req.body.year;
    // uin | cert_id | cert_status | training_status | program_num | semester | yr

    pool.query(`INSERT INTO cert_enrollment(uin, cert_id, cert_status, training_status, program_num, semester, yr) VALUES (${uin}, ${cert_id},'${cert_status}','${training_status}', ${program_num}, '${semester}', ${year})`, (err, result) => {
        if(err) {
            console.log(err);
            res.status(400).json({message: "Error creating class!"});
        }
        res.status(200).json({message: "Success!"});
    })
});

/////
//update

/** Update Class route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: update 
 */
router.post("/updateClass", async (req, res) => {

    let ID = req.body.ID;
    let name = req.body.name;
    let description = req.body.description;
    let classType = req.body.classType;
    //console.log(ID, name, description, classType);
    //class_name | class_description |    class_type

    pool.query(`UPDATE classes SET class_name='${name}', class_description='${description}', class_type='${classType}' WHERE class_id=${ID}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error updating program!" })
        }
        const payload = {
            class_id: ID,
            class_name: name,
            class_description: description,
            class_type: classType
        };

        // Sign token
        jwt.sign(
            payload,
            keys.secretOrKey,
            {
                expiresIn: 604800, // 7 days in seconds
            },
            (err, token) => {
                res.status(200).json({
                    success: true,
                    token: "Bearer " + token,
                });
            }
        );
    })
});

/** Update Internship route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: update 
 */
router.post("/updateInternship", async (req, res) => {

    let ID = req.body.ID;
    let name = req.body.name;
    let description = req.body.description;
    let isGov = (req.body.isGov === "Yes");
    let location = req.body.location;
    console.log(ID, name, description, isGov, location);
    //intern_id | company_name | intern_description | is_gov |  location

    pool.query(`UPDATE internship SET company_name='${name}', intern_description='${description}', is_gov=${isGov}, location='${location}' WHERE intern_id=${ID}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error updating program!" })
        }
        const payload = {
            intern_id: ID,
            company_name: name,
            intern_description: description,
            is_gov: isGov,
            location: location
        };

        // Sign token
        jwt.sign(
            payload,
            keys.secretOrKey,
            {
                expiresIn: 604800, // 7 days in seconds
            },
            (err, token) => {
                res.status(200).json({
                    success: true,
                    token: "Bearer " + token,
                });
            }
        );
    })
});

/** Update Certification route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: update 
 */
router.post("/updateCertification", async (req, res) => {

    let ID = req.body.ID;
    let name = req.body.name;
    let description = req.body.description;
    let certLevel = req.body.certLevel;
    // cert_id | cert_level |    cert_name     | cert_description

    pool.query(`UPDATE certification SET cert_name='${name}', cert_description='${description}', cert_level='${certLevel}' WHERE cert_id=${ID}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error updating program!" })
        }
        const payload = {
            cert_id: ID,
            cert_name: name,
            cert_description: description,
            cert_level: certLevel
        };

        // Sign token
        jwt.sign(
            payload,
            keys.secretOrKey,
            {
                expiresIn: 604800, // 7 days in seconds
            },
            (err, token) => {
                res.status(200).json({
                    success: true,
                    token: "Bearer " + token,
                });
            }
        );
    })
});

/** Update Class Enrollment route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: update 
 */
router.post("/updateClassEnrollment", async (req, res) => {

    let ce_num = req.body.ce_num;
    let uin = req.body.uin;
    let class_id = req.body.class_id;
    let status = req.body.status;
    let semester = req.body.semester;
    let year = req.body.year;
    // ce_num |    uin    | class_id |  class_status   | semester |  yr

    pool.query(`UPDATE class_enrollment SET uin='${uin}', class_id='${class_id}', class_status='${status}', semester='${semester}', yr=${year} WHERE ce_num=${ce_num}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error updating program!" })
        }
        const payload = {
            ce_num: ce_num,
            uin: uin,
            class_id: class_id,
            class_status: status,
            semester: semester,
            yr: year
        };

        // Sign token
        jwt.sign(
            payload,
            keys.secretOrKey,
            {
                expiresIn: 604800, // 7 days in seconds
            },
            (err, token) => {
                res.status(200).json({
                    success: true,
                    token: "Bearer " + token,
                });
            }
        );
    })
});

/** Update Internship Application route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: update 
 */
router.post("/updateInternshipApplication", async (req, res) => {

    let ia_num = req.body.ia_num;
    let uin = req.body.uin;
    let intern_id = req.body.intern_id;
    let status = req.body.status;
    let year = req.body.year
    console.log(ia_num, uin, intern_id, status, year);
    // ia_num |    uin    | intern_id | intern_status |  yr

    pool.query(`UPDATE intern_app SET uin='${uin}', intern_id='${intern_id}', intern_status='${status}', yr=${year} WHERE ia_num=${ia_num}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error updating program!" })
        }
        const payload = {
            ia_num: ia_num,
            uin: uin,
            intern_id: intern_id,
            intern_status: status,
            yr: year
        };

        // Sign token
        jwt.sign(
            payload,
            keys.secretOrKey,
            {
                expiresIn: 604800, // 7 days in seconds
            },
            (err, token) => {
                res.status(200).json({
                    success: true,
                    token: "Bearer " + token,
                });
            }
        );
    })
});

/** Update Certification Enrollment route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: update 
 */
router.post("/updateCertificationEnrollment", async (req, res) => {

    let certe_num = req.body.certe_num;
    let uin = req.body.uin;
    let cert_id = req.body.cert_id;
    let status = req.body.status;
    let training_status = req.body.training_status;
    let program_num = req.body.program_num;
    let semester = req.body.semester;
    let year = req.body.year;
    console.log(certe_num, uin, cert_id, status, training_status, program_num, semester, year);
    //  certe_num |    uin    | cert_id | cert_status | training_status | program_num | semester |  yr

    pool.query(`UPDATE cert_enrollment SET uin='${uin}', cert_id='${cert_id}', cert_status='${status}', training_status='${training_status}', program_num=${program_num}, semester='${semester}', yr=${year} WHERE certe_num=${certe_num}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error updating program!" })
        }
        const payload = {
            certe_num: certe_num,
            uin: uin,
            cert_id: cert_id,
            cert_status: status,
            training_status: training_status,
            program_num: program_num,
            semester: semester,
            yr: year
        };

        // Sign token
        jwt.sign(
            payload,
            keys.secretOrKey,
            {
                expiresIn: 604800, // 7 days in seconds
            },
            (err, token) => {
                res.status(200).json({
                    success: true,
                    token: "Bearer " + token,
                });
            }
        );
    })
});

/////
//delete

/** Delete Class route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: delete 
 */
router.post("/deleteClass", async (req, res) => {
    const ID = req.body.ID;
    
    pool.query(`DELETE FROM classes WHERE class_id=${ID}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error deleting Program!" })
        }
        res.status(200).json({ message: "Success!" })
    })
});

/** Delete Class Enrollments (all) route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: delete 
 */
router.post("/deleteClassEnrollments", async (req, res) => {
    const ID = req.body.ID;

    pool.query(`DELETE FROM class_enrollment WHERE class_id = ${ID}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error deleting event from track table!" });
        }
        res.status(200).json({ message: "Success!" });
    })
});

/** Delete Class Enrollment (single) route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: delete 
 */
router.post("/deleteClassEnrollment", async (req, res) => {
    const num = req.body.num;

    pool.query(`DELETE FROM class_enrollment WHERE ce_num = ${num}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error deleting event from track table!" });
        }
        res.status(200).json({ message: "Success!" });
    })
});

///// internship

/** Delete Internship route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: delete 
 */
router.post("/deleteInternship", async (req, res) => {
    const ID = req.body.ID;
    
    pool.query(`DELETE FROM internship WHERE intern_id=${ID}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error deleting Program!" })
        }
        res.status(200).json({ message: "Success!" })
    })
});

/** Delete Internship Applications (all) route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: delete 
 */
router.post("/deleteInternshipApps", async (req, res) => {
    const ID = req.body.ID;

    pool.query(`DELETE FROM intern_app WHERE intern_id = ${ID}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error deleting event from track table!" });
        }
        res.status(200).json({ message: "Success!" });
    })
});

/** Delete Internship Application (single) route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: delete 
 */
router.post("/deleteInternshipApp", async (req, res) => {
    const num = req.body.num;

    pool.query(`DELETE FROM intern_app WHERE ia_num = ${num}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error deleting event from track table!" });
        }
        res.status(200).json({ message: "Success!" });
    })
});

///// certification

/** Delete Class route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: delete 
 */
router.post("/deleteCertification", async (req, res) => {
    const ID = req.body.ID;
    
    pool.query(`DELETE FROM certification WHERE cert_id=${ID}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error deleting Program!" })
        }
        res.status(200).json({ message: "Success!" })
    })
});

/** Delete Class Enrollments (all) route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: delete 
 */
router.post("/deleteCertificationEnrollments", async (req, res) => {
    const ID = req.body.ID;

    pool.query(`DELETE FROM cert_enrollment WHERE cert_id = ${ID}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error deleting event from track table!" });
        }
        res.status(200).json({ message: "Success!" });
    })
});

/** Delete Class Enrollment (single) route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL: delete 
 */
router.post("/deleteCertificationEnrollment", async (req, res) => {
    const num = req.body.num;

    pool.query(`DELETE FROM cert_enrollment WHERE certe_num = ${num}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error deleting event from track table!" });
        }
        res.status(200).json({ message: "Success!" });
    })
});

module.exports = router;