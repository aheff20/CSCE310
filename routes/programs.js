const express = require("express");
const { Pool, Client } = require("pg");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require('../config/keys');
const bcrypt = require("bcryptjs");
const { pool } = require("../dbInstance");
// import {pool} from "../dbInstance";


/** Get all Program Information route created and implemented by:
 *    Lucas Wilber
 * 
 *    SQL:
 *      * Select 
 */
router.get("/getAllProgramData", async (req, res) => {

    pool.query(`SELECT * FROM programs`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json("Error getting all program information")
        }
        res.status(200).json(result.rows);
    })

});

/** Check Program exists route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL:
 *      * Select 
 */
router.get("/exists", async (req, res) => {
    const programNum = req.query.programNum;

    pool.query(`SELECT * FROM programs WHERE program_num=${programNum} LIMIT 1`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: `Error getting program ${programNum} details!` });
        }

        if (result.rows.length > 0) {
            res.status(200).json({ valid: true });
        }
        else res.status(200).json({ valid: false });
    })
});

/** Get Single Program Information route created and implemented by:
 *    Lucas Wilber
 * 
 *    SQL:
 *      * Select 
 */
router.get("/getProgramInfo", async (req, res) => {
    const programNum = req.query.programNum;

    pool.query(`SELECT * FROM programs WHERE program_num=${programNum}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: `Error getting program ${programNum} details!` })
        }
        res.status(200).json(result.rows[0]);
    })
});

/** Get Program Users route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL:
 *      * Select 
 */
router.get("/getProgramUsers", async (req, res) => {
    const programNum = req.query.programNum;
    //console.log(`getting users for ${programNum}`)

    pool.query(`SELECT C.* FROM programs P JOIN track T ON T.program_num = P.program_num JOIN college_student C ON T.uin = C.uin WHERE P.program_num = ${programNum}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error getting program users!" })
        }
        //console.log(result);
        res.status(200).json(result.rows)
    })
})

/** Get Program Events route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL:
 *      * Select 
 */
router.get("/getProgramEvents", async (req, res) => {
    const programNum = req.query.programNum;
    //console.log(`getting users for ${programNum}`)

    pool.query(`SELECT * FROM event WHERE program_num = ${programNum}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error getting program users!" })
        }
        //console.log(result);
        res.status(200).json(result.rows)
    })
})

/** Get Uploaded Documents route created and implemented by:
 *  Billy Harkins
 *  
 *  SQL: SELECT
 */
router.get("/getUploadedDocuments", async (req, res) => {
    const app_num = req.query.app_num;

    pool.query(`SELECT * FROM documentation WHERE app_num = ${app_num}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json("Error getting all uploaded document information")
        }
        res.status(200).json(result.rows);
    })

});

/** Create Document route created and implemented by:
 *  Billy Harkins
 *  
 *  SQL: INSERT
 */
router.post("/createDocument", async (req, res) => {
    const app_num = req.body.app_num;
    const link = req.body.link;
    const doc_type = req.body.doc_type;

    pool.query(`INSERT INTO documentation(app_num, link, doc_type) VALUES(${app_num}, '${link}', '${doc_type}')`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error creating document!" });
        }
        res.status(200).json({ message: "Success!" });
    })
});

/** Update Document route created and implemented by:
 *  Billy Harkins
 *  
 *  SQL: UPDATE
 */
router.post("/updateDocument", async (req, res) => {
    const doc_num = req.body.doc_num;
    const app_num = req.body.app_num;
    const link = req.body.link;
    const doc_type = req.body.doc_type;

    pool.query(`UPDATE documentation SET app_num = ${app_num}, link = '${link}', doc_type = '${doc_type}' WHERE doc_num = ${doc_num}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error editing document!" });
        }
        res.status(200).json({ message: "Success!" });
    })
});

/** Delete Document route created and implemented by:
 *  Billy Harkins
 *  
 *  SQL: DELETE
 */
router.post("/deleteDocument", async (req, res) => {
    const doc_num = req.body.doc_num;

    pool.query(`DELETE FROM documentation WHERE doc_num = ${doc_num}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error deleting document!" });
        }
        res.status(200).json({ message: "Success!" });
    })
});

/** Delete Documents Of Application route created and implemented by:
 *  Billy Harkins
 *  
 *  SQL: DELETE
 */
router.post("/deleteDocumentsOfApplication", async (req, res) => {
    const app_num = req.body.app_num;

    pool.query(`DELETE FROM documentation WHERE app_num = ${app_num}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error deleting documents assigned to given application!" });
        }
        res.status(200).json({ message: "Success!" });
    })
});

/** Create Application route created and implemented by:
 *    Lucas Wilber
 * 
 *    SQL:
 *      * Insert 
 */
router.post("/createApplication", async (req, res) => {
    const program_num = req.body.program_num;
    const uin = req.body.uin;
    const uncom_cert = req.body.uncom_cert;
    const com_cert = req.body.com_cert;
    const purpose_statement = req.body.purpose;

    pool.query(`INSERT INTO applications (program_num, uin, uncom_cert, com_cert, purpose_statement) VALUES ($1, $2, $3, $4, $5)`, [program_num, uin, uncom_cert, com_cert, purpose_statement], (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error creating application!" });
        }
        res.status(200).json({ message: "Success!" });
    })
});

/** Create Program route created and implemented by:
 *    Lucas Wilber
 * 
 *    SQL:
 *      * Insert 
 */
router.post("/createProgram", async (req, res) => {
    const programData = {};

    programData.program_name = req.body.program_name;
    programData.program_description = req.body.program_description;
    programData.active = true;

    const isProgramDataValid = validateProgramInfo(programData)
    if (isProgramDataValid != true) {
        return res.status(201).json(isProgramDataValid);
    }

    pool.query(`INSERT INTO programs (program_name, program_description, active) VALUES ($1, $2, $3)`, [programData.program_name, programData.program_description, programData.active], (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error creating program!" });
        }
        res.status(200).json({ message: "Success!" });
    })
});


/** Update Program route created and implemented by:
 *    Lucas Wilber
 * 
 *    SQL:
 *      * Update 
 */
router.post("/updateProgramInfo", async (req, res) => {
    const programData = {};

    programData.program_num = req.body.programNum;
    programData.program_name = req.body.updatedName;
    programData.program_description = req.body.updatedDesc;


    const isProgramDataValid = validateProgramInfo(programData)
    if (isProgramDataValid != true) {
        return res.status(201).json(isProgramDataValid);
    }

    pool.query(`UPDATE programs SET program_name='${programData.program_name}', program_description='${programData.program_description}' WHERE program_num=${programData.program_num}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error updating program!" })
        }
        const payload = {
            program_num: programData.program_num,
            program_name: programData.program_name,
            program_description: programData.program_description,
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

/** Update Program Access Status/Attribute route created and implemented by:
 *    Lucas Wilber
 * 
 *    SQL:
 *      * Update 
 */
router.post("/updateProgramActiveStatus", async (req, res) => {
    const programData = req.body.program;

    pool.query(`UPDATE programs SET active=${programData.active} WHERE program_num=${programData.program_num}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error updating program access!" })
        }
        const payload = {
            program: programData
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

/** Delete Program route created and implemented by:
 *    Lucas Wilber
 * 
 *    SQL:
 *      * Delete 
 */
router.post("/deleteProgram", async (req, res) => {
    const program_num = req.body.program_num;
    //console.log("deleting program "+program_num);
    pool.query(`DELETE FROM programs WHERE program_num=${program_num}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error deleting Program!" })
        }
        res.status(200).json({ message: "Success!" })
    })
});

/** Delete Program track route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL:
 *      * Delete 
 */
router.post("/deleteProgramTrack", async (req, res) => {
    const program_num = req.body.program_num;

    pool.query(`DELETE FROM track WHERE program_num = ${program_num}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error deleting event from track table!" });
        }
        res.status(200).json({ message: "Success!" });
    })
})

/** Delete Program applications route created and implemented by:
 *    Logan Carbo
 * 
 *    SQL:
 *      * Delete 
 */
router.post("/deleteProgramApplications", async (req, res) => {
    const program_num = req.body.program_num;

    pool.query(`DELETE FROM applications WHERE program_num = ${program_num}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error deleting event from track table!" });
        }
        res.status(200).json({ message: "Success!" });
    })
})

const validateProgramInfo = (programData) => {
    if (programData.program_name == "") {
        return { program_name: "Please enter a name!" }
    }
    if (programData.program_description == "") {
        return { program_description: "Please enter a description!" }
    }

    return true;
}

module.exports = router;
