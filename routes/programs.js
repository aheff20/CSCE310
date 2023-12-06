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
            res.status(400).json({ message: `Error getting program ${program_num} details!` })
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


router.get("/getProgramData", async (req, res) => {
    const p_num = req.query.program_num;

    pool.query(`SELECT * FROM programs WHERE program_num=${program_num}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json(`Error getting program ${program_num} information`)
        }
        res.status(200).json(result.rows);
    })

});


module.exports = router;
