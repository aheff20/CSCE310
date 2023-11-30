const express = require("express");
const { Pool, Client } = require("pg");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require('../config/keys');
const bcrypt = require("bcryptjs");
const { pool } = require("../dbInstance");
// import {pool} from "../dbInstance";


router.post("/login", (req, res) => {

  const username = req.body.username.trim();
  const password = req.body.password.trim();

  pool.query('SELECT * FROM users', (err, result) => {
    if(err) {
      return console.log('Error executing query', err.stack)
    }

    for(let i = 0; i < result.rows.length; i++){
      if(result.rows[i].username === username){
        bcrypt.compare(password, result.rows[i].pass).then((isMatch) => {

          if(isMatch){
            const payload = {
              uin: result.rows[i].uin,
              first_name: result.rows[i].first_name,
              last_name: result.rows[i].last_name,
              m_initial: result.rows[i].m_initial,
              username: result.rows[i].username,
              user_type: result.rows[i].user_type,
              email: result.rows[i].email,
              discord: result.rows[i].discord,
            };

            // Sign token
            jwt.sign(
              payload,
              keys.secretOrKey,
              {
                expiresIn: 604800, // 7 days in seconds
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token,
                });
              }
            );
    
            return;
          }else{
            return res
              .status(400)
              .json({ invalidLogin: "Username or Password is incorrect" });
          }
        });
      }
    }

  })

});

router.post("/register", async (req, res) => {
    const uin = req.body.uin.trim();
    const first_name = req.body.first_name.trim();
    const m_initial = req.body.m_initial.trim();
    const last_name = req.body.last_name.trim();
    const username = req.body.username.trim();
    const discord = req.body.discord.trim();
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    const password2 = req.body.password2.trim();
    const userType = req.body.userType.trim();

    const gender = req.body.gender;
    const hispanicLatino = req.body.hispanicLatino;
    const race = req.body.race;
    const citizen = req.body.citizen;
    const firstGen = req.body.firstGen;
    const dob = req.body.dob;
    const gpa = req.body.gpa;
    const major = req.body.major;
    const minor1 = req.body.minor1;
    const minor2 = req.body.minor2;
    const graduation = req.body.graduation;
    const school = req.body.school;
    const classification = req.body.classification;
    const studentType = req.body.studentType;
    const phone = req.body.phone;

    if(isNaN(uin) || isNaN(parseFloat(uin))) {
      return res.status(400).json({uin: "Please enter a valid uin!"})
    }
    if(first_name == ""){
      return res.status(400).json({first_name: "Please enter a name!"})
    }
    if(last_name == ""){
      return res.status(400).json({last_name: "Please enter a name!"})
    }
    if(m_initial.length > 1){
      return res.status(400).json({m_initial: "Please only use 1 initial!"})
    }    
    if(!email.includes("@")){
      return res.status(400).json({registerEmail: "Invalid email!"});
    }
    if(password != password2){
      return res.status(400).json({registerPassword2: "Password does not match!"});
    }
    if(discord == "") {
      return res.status(400).json({discord: "Please enter a discord!"});
    }

    if(userType == "Student") {
      if(gender == "Choose Gender") {
        return res.status(400).json({gender: "Please select a gender!"});
      }
      if(hispanicLatino == "Select Option") {
        return res.status(400).json({hispaniclatino: "Please select an option!"});
      }
      if(race == "Select Race") {
        return res.status(400).json({race: "Please select a race!"});
      }
      if(citizen == "Select Option") {
        return res.status(400).json({citizen: "Please select an option!"});
      }
      if(firstGen == "Select Option") {
        return res.status(400).json({firstGen: "Please select an option!"});
      }
      if(dob == "") {
        return res.status(400).json({dob: "Please enter a date of birth!"});
      }
      if(!major) {
        return res.status(400).json({major: "Please enter a Major!"});
      }
      if(!gpa) {
        return res.status(400).json({gpa: "Please enter gpa!"});
      }
      if(!graduation) {
        return res.status(400).json({graduation: "Please enter grad year!"});
      }
      if(graduation && parseInt(graduation) < 2020){
        return res.status(400).json({graduation: "Please enter a valid grad year!"});
      }
      if(!school) {
        return res.status(400).json({school: "Please enter your school!"});
      }
      if(classification == "Select Classification") {
        return res.status(400).json({classification: "Please select a classification!"});
      }
      if(studentType == "Select Type") {
        return res.status(400).json({studentType: "Please select a type!"});
      }
      if(!phone) {
        return res.status(400).json({phone: "Please enter a phone number!"});
      }
    }
    
    
    pool.query('SELECT * FROM users', (err, result) => {
      if(err) {
        return console.log('Error executing query', err.stack)
      }

      for(let i = 0; i < result.rows.length; i++){
        if(email == result.rows[i].email){
          return res.status(400).json({registerEmail: "Email already exists!"});
        }
        if(username == result.rows[i].username){
          return res.status(400).json({registerUsername: "Username already exists!"});
        }
        if(uin == result.rows[i].uin){
            return res.status(400).json({uin: "UIN already exists!"});
          }
      }

      let password_hashed = "";

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if(err){
            console.log(err);
            res.status(400).json({message: "Error creating account!"});
          };
          password_hashed = hash;

          if(userType == "Admin") {
            pool.query(`INSERT INTO users VALUES (${uin}, '${first_name}', '${last_name}', '${m_initial}', '${email}', '${discord}', '${username}', '${password_hashed}', '${userType}')`, (err, result) => {
              if(err) {
                return console.log('Error executing query', err.stack)
              }
              res.status(200).json(result);
            })
          } else {
            pool.query(`INSERT INTO college_student VALUES (${uin}, '${first_name}', '${last_name}', '${m_initial}', '${email}', '${discord}', '${username}', '${password_hashed}', '${userType}',
             '${gender}', ${hispanicLatino=="Yes"}, '${race}', ${citizen=="Yes"}, ${firstGen=="Yes"}, '${dob}', ${gpa}, '${major}', '${minor1}', '${minor2}', ${graduation}, '${school}', '${classification}',
             '${studentType}', '${phone}' )`, (err, result) => {
              if(err) {
                return console.log('Error executing query', err.stack)
              }
              res.status(200).json(result);
            })
          }
          
        })
      })


    });


});


router.get("/getAllUserData", async (req, res) => {
    pool.query("SELECT * FROM users", (err, result) => {
      if(err) {
        console.log(err);
        res.status(400).json({message: "Error Getting user accounts!"})
      }
      res.status(200).json(result.rows);

    });
})

router.get("/getUserData", async(req, res) => {
  const uin = req.query.uin;
  const userType = req.query.userType;

  if(userType === "Admin") {
    pool.query(`SELECT * FROM users WHERE uin=${uin}`, (err, result) => {
      if(err) {
        console.log(err);
        res.status(400).json({message: "Error getting user data!"});
      }
      res.status(200).json(result.rows[0])
    })
    
  } else {
    pool.query(`SELECT * FROM college_student WHERE uin=${uin}`, (err, result) => {
      if(err) {
        console.log(err);
        res.status(400).json({message: "Error getting user data!"});
      }
      res.status(200).json(result.rows[0])
    })
  }
  

});


module.exports = router;
