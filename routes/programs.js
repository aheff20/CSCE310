const express = require("express");
const { Pool, Client } = require("pg");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require('../config/keys');
const bcrypt = require("bcryptjs");
const { pool } = require("../dbInstance");
// import {pool} from "../dbInstance";

router.get("/getAllProgramData", async (req, res) => {

    pool.query(`SELECT * FROM programs`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json("Error getting all program information")
        }
        res.status(200).json(result.rows);
    })

});


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

    pool.query(`UPDATE programs SET program_name=${programData.program_name}, program_description=${programData.program_description} WHERE program_num=${programData.program_num}`, (err, result) => {
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
