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
    const userData = {}

    userData.uin = req.body.uin.trim();
    userData.first_name = req.body.first_name.trim();
    userData.m_initial = req.body.m_initial.trim();
    userData.last_name = req.body.last_name.trim();
    userData.username = req.body.username.trim();
    userData.discord = req.body.discord.trim();
    userData.email = req.body.email.trim();
    userData.password = req.body.password.trim();
    userData.password2 = req.body.password2.trim();
    userData.userType = req.body.userType.trim();

    userData.gender = req.body.gender;
    userData.hispanicLatino = req.body.hispanicLatino;
    userData.race = req.body.race;
    userData.citizen = req.body.citizen;
    userData.firstGen = req.body.firstGen;
    userData.dob = req.body.dob;
    userData.gpa = req.body.gpa;
    userData.major = req.body.major;
    userData.minor1 = req.body.minor1;
    userData.minor2 = req.body.minor2;
    userData.graduation = req.body.graduation;
    userData.school = req.body.school;
    userData.classification = req.body.classification;
    userData.studentType = req.body.studentType;
    userData.phone = req.body.phone;
   
    const isUserDataValid = validateUserInfo(userData)
    if(isUserDataValid != true) {
      return res.status(400).json(isUserDataValid);
    }
    
    pool.query('SELECT * FROM users', (err, result) => {
      if(err) {
        return console.log('Error executing query', err.stack)
      }

      for(let i = 0; i < result.rows.length; i++){
        if(userData.email == result.rows[i].email){
          return res.status(400).json({registerEmail: "Email already exists!"});
        }
        if(userData.username == result.rows[i].username){
          return res.status(400).json({registerUsername: "Username already exists!"});
        }
        if(userData.uin == result.rows[i].uin){
            return res.status(400).json({uin: "UIN already exists!"});
          }
      }

      let password_hashed = "";

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(userData.password, salt, (err, hash) => {
          if(err){
            console.log(err);
            res.status(400).json({message: "Error creating account!"});
          };
          password_hashed = hash;

          if(userData.userType == "Admin") {
            pool.query(`INSERT INTO users VALUES (${userData.uin}, '${userData.first_name}', '${userData.last_name}', '${userData.m_initial}', '${userData.email}', '${userData.discord}', 
            '${userData.username}', '${userData.password_hashed}', '${userData.userType}')`, (err, result) => {
              if(err) {
                return console.log('Error executing query', err.stack)
              }
              res.status(200).json(result);
            })
          } else {
            pool.query(`INSERT INTO college_student VALUES (${userData.uin}, '${userData.first_name}', '${userData.last_name}', '${userData.m_initial}', '${userData.email}', 
            '${userData.discord}', '${userData.username}', '${userData.password_hashed}', '${userData.userType}', '${userData.gender}', ${userData.hispanicLatino=="Yes"}, 
            '${userData.race}', ${userData.citizen=="Yes"}, ${userData.firstGen=="Yes"}, '${userData.dob}', ${userData.gpa}, '${userData.major}', '${userData.minor1}', '${userData.minor2}',
             ${userData.graduation}, '${userData.school}', '${userData.classification}', '${userData.studentType}', '${userData.phone}' )`, (err, result) => {
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

router.post("/updateUserInfo", async(req, res) => {
  const userData = {}

  userData.userType = req.body.params.userType;
  userData.uin = req.body.params.uin;
  userData.first_name = req.body.params.updatedFName;
  userData.last_name = req.body.params.updatedLName;
  userData.m_initial = req.body.params.updatedMInitial;
  userData.email = req.body.params.updatedEmail;
  userData.discord = req.body.params.updatedDiscord;
  userData.username = req.body.params.updatedUsername;

  userData.gender = req.body.params.updatedGender;
  userData.hispanicLatino = req.body.params.updatedHispanicLatino;
  userData.race = req.body.params.updatedRace;
  userData.citizen = req.body.params.updatedCitizen;
  userData.firstGen = req.body.params.updatedFirstGen;
  userData.dob = req.body.params.updatedDOB;
  userData.gpa = req.body.params.updatedGPA;
  userData.major = req.body.params.updatedMajor;
  userData.minor1 = req.body.params.updatedMinor1;
  userData.minor2 = req.body.params.updatedMinor2;
  userData.graduation = req.body.params.updatedGraduation;
  userData.school = req.body.params.updatedSchool;
  userData.classification = req.body.params.updatedClassification;
  userData.studentType = req.body.params.updatedStudentType;
  userData.phone = req.body.params.updatedPhone;

  const isUserDataValid = validateUserInfo(userData)
    if(isUserDataValid != true) {
      return res.status(201).json(isUserDataValid);
    }
    
  if(userData.userType == "Admin") {
    pool.query(`UPDATE users SET first_name='${userData.first_name}', last_name='${userData.last_name}', m_initial='${userData.m_initial}', 
    email='${userData.email}', discord='${userData.discord}', username='${userData.username}' WHERE uin=${userData.uin}`, (err, result) => {
      if(err) {
        console.log(err);
        res.status(400).json({message: "Error updating user!"})
      }
      res.status(200).json({message: "Success!"})

    })
  } else {
    pool.query(`UPDATE college_student SET first_name='${userData.first_name}', last_name='${userData.last_name}', m_initial='${userData.m_initial}', email='${userData.email}', 
        discord='${userData.discord}', username='${userData.username}', gender='${userData.gender}', hispanic_latino=${userData.hispanicLatino=="Yes"}, 
        race='${userData.race}', citizen=${userData.citizen=="Yes"}, first_gen=${userData.firstGen=="Yes"}, dob='${userData.dob}', gpa=${userData.gpa}, major='${userData.major}', minor_1='${userData.minor1}', minor_2='${userData.minor2}',
        expected_graduation=${userData.graduation}, school='${userData.school}', classification='${userData.classification}', student_type='${userData.studentType}', phone='${userData.phone}' WHERE uin=${userData.uin}`, (err, result) => {
        if(err) {
          return console.log('Error executing query', err.stack)
        }
        res.status(200).json({message: "Success!"});
      })

  }

});



const validateUserInfo = (userData) => {
  if(isNaN(userData.uin) || isNaN(parseFloat(userData.uin))) {
    return {uin: "Please enter a valid uin!"}
  }
  if(userData.first_name == ""){
    return {first_name: "Please enter a name!"}
  }
  if(userData.last_name == ""){
    return {last_name: "Please enter a name!"}
  }
  if(userData.m_initial && userData.m_initial.length > 1){
    return {m_initial: "Please only use 1 initial!"}
  }    
  if(!userData.email.includes("@")){
    return {registerEmail: "Invalid email!"}
  }
  if(userData.password != userData.password2){
    return {registerPassword2: "Password does not match!"}
  }
  if(userData.username == "") {
    return {registerUsername: "Please enter a username!"}
  }
  if(userData.password == "") {
    return {registerPassword: "Please enter a password!"}
  }
  if(userData.discord == "") {
    return {discord: "Please enter a discord!"}
  }

  if(userData.userType == "Student") {
    if(userData.gender == "Choose Gender") {
      return {gender: "Please select a gender!"}
    }
    if(userData.hispanicLatino == "Select Option") {
      return {hispaniclatino: "Please select an option!"}
    }
    if(userData.race == "Select Race") {
      return {race: "Please select a race!"}
    }
    if(userData.citizen == "Select Option") {
      return {citizen: "Please select an option!"}
    }
    if(userData.firstGen == "Select Option") {
      return {firstGen: "Please select an option!"}
    }
    if(userData.dob == "") {
      return {dob: "Please enter a date of birth!"}
    }
    if(!userData.major) {
      return {major: "Please enter a Major!"}
    }
    if(!userData.gpa) {
      return {gpa: "Please enter gpa!"}
    }
    if(!userData.graduation) {
      return {graduation: "Please enter grad year!"}
    }
    if(userData.graduation && parseInt(userData.graduation) < 2020){
      return {graduation: "Please enter a valid grad year!"}
    }
    if(!userData.school) {
      return {school: "Please enter your school!"}
    }
    if(userData.classification == "Select Classification") {
      return {classification: "Please select a classification!"}
    }
    if(userData.studentType == "Select Type") {
      return {studentType: "Please select a type!"}
    }
    if(!userData.phone) {
      return {phone: "Please enter a phone number!"}
    }
  }


  return true;
}

module.exports = router;
