const express = require('express')
const router = express.Router()
const pool = require('../db')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const verify = require('../util/verify')

//Log-in user
router.post('/login', function (req, res) {
  const { email, password } = req.body

  pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
    if(error){
      console.log(error)
      return res.send({success: false, message: 'Server Error'})
    }
    else if (result.rowCount){
      bcrypt.compare(password, result.rows[0].password, function (err, check) {
        if (check){
          const token = jwt.sign({uid: result.rows[0].id}, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE })
          //const refreshToken = jwt.sign({userId: result.rows[0].id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFE})
          return res.send({success: true, message: 'Logged In', name: result.rows[0].first_name, accessToken:token})
          //return res.cookie('refresh-token', token, { httpOnly: true, secure: true})
        }
        else{
          return res.send({success: false, message:'Password'});
        }
      })
    }
    else { return res.send({success: false, message:'Email'}) }
  })
})

//User sign-in
router.post('/signup', function (req, res) {
  const { user_name, first_name, last_name, email, password } = req.body

  //Check for email
  pool.query('SELECT * FROM users WHERE email = $1 or user_name = $2', [email, user_name], (error, result) => {
    //Servor error
    if(error){
      console.log(error)
      res.send({success: false, message: 'Server Error'})
    }
    //User is already in system
    else if(result.rowCount){
      if (result.rows[0].email === email){
        res.send({success: false, message:'Email'})
      } else if (result.rows[0].user_name === user_name){
        res.send({success: false, message:'Username'})
      }
    }
    else {
      bcrypt.hash(password, 10, function(error, hash) {
        if (error){
            res.send({success: false, message:'Server Error'})
            console.log(error)
            return reject(error);
        }
      // Store hash in database
        pool.query('INSERT INTO users (user_name, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)', [user_name, first_name, last_name, email, hash], (error, result) => {
          if (error) {
            console.log(error)
            res.send({success: false, message:'Server Error'})
          }
          res.send({success: true, message:'User Registered!'})
        })
      })
    }
  })
})

// Get basic account data
router.get('/account/basic', verify, function (req, res) {
  const id = req.body.id;

  pool.query('SELECT user_name, wallet FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    if (results.rows.length === 0){
      return res.send({success: false, message:'No user'})
    }
    return res.status(200).send({success: true, username:results.rows[0].user_name, wallet:results.rows[0].wallet})
  })
})

//Get all account data
router.get('/account', verify, function (req, res) {
  const id = req.body.id;

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    if (results.rows.length === 0){
      return res.send({success: false, message:'No user'})
    }
    return res.status(200).send({success: true, data:results.rows[0]})
  })
})

// Get account data
router.get('/verify', verify, function (req, res) {
  const id = req.dy.id;

  pool.query('SELECT CASE WHEN EXISTS (SELECT 1 FROM users WHERE id = $1) THEN true ELSE false end', [id], (error, results) => {
    if (error) {
      throw error
    }
    if (results.rows.length === 0){
      return res.send({success: false, message:'No user'})
    }
    return res.status(200).send({success: results.rows[0].case})
  })
})




module.exports = router
