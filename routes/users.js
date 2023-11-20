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
        bcrypt.compare(password, result.rows[i].password).then((isMatch) => {

          if(isMatch){
            const payload = {
              id: result.rows[i].uin,
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
              .json({ passwordincorrect: "Password incorrect" });
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

    let userID = 0;

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

          pool.query(`INSERT INTO users VALUES ('${uin}', '${first_name}', '${last_name}', '${m_initial}', '${email}', '${discord}', '${username}', '${password_hashed}', 'admin')`, (err, result) => {
            if(err) {
              return console.log('Error executing query', err.stack)
            }
            res.status(200).json(result);
          })
        })
      })


    });


});


module.exports = router;
