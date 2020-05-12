const express = require('express')
const router = express.Router()
const pool = require('../db')
const setNull = require('../util/setNull')
const verify = require('../util/verify')

// Get users data
router.get('/user', verify, function (req, res) {
  const creator_id = req.body.id;

  // if (!Number.isInteger(creator_id)){
  //   return res.status(400).send({success: false, message:'Input - Server Error'})
  // }

  pool.query('SELECT * FROM tasks WHERE creator_id = $1 ORDER BY date_posted', [creator_id], (error, results) => {
    if (error) {
      throw error
    }
    if (results.rows.length === 0){
      return res.send({success: false, message:'No data'})
    }
    return res.status(200).send({success: true, message: results.rows})
  })
})

// Get all job entries
router.get('/:id', function (req, res) {
  const creator_id = parseInt(req.params.id)

  if (!Number.isInteger(creator_id)){
    return res.status(400).send({success: false, message:'Input - Server Error'})
  }
  console.log(creator_id)

  pool.query('SELECT * FROM tasks WHERE creator_id = $1 ORDER BY date_posted', [creator_id], (error, results) => {
    if (error) {
      throw error
    }
    if (results.rows.length === 0){
      return res.status(400).send({success: false, message:'No match'})
    }
    return res.status(200).json(results.rows)
  })
})

// Create new job entry
router.post('/create', verify, function (req, res) {
  if (req.body.published === 'on'){
    req.body.published = true
    pool.query('UPDATE users SET tasks_published = tasks_published+1, wallet=wallet-$2 WHERE id = $1', [req.body.id, req.body.cost], (error) => {
      if (error) {
        console.log(error)
        return res.status(400).send({success: false, message:'Server Error'})
      }
    })
  } else{
    req.body.published = false
  }

  var task = { id, header, priority, cost, type, description, date_expected, published } = req.body
  nullTask = setNull(task)

  // Store job info database
  pool.query('INSERT INTO tasks (creator_id, header, priority, cost, type, description, date_expected, published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
   [id, header, priority, cost, type, description, date_expected, published],
   (error, result) => {
    if (error) {
      console.log(error)
      return res.status(400).send({success: false, message:'Server Error'})
    }
    return res.send({success: true, message:'Task Added!'})
  })
})

// Update job entry
router.put('/edit/:id', verify, function (req, res) {

  const task_id = parseInt(req.params.id)
  var task = { header, priority, cost, type, description, date_expected, id} = req.body
  nullTask = setNull(task)

  // Store job info database
  pool.query('UPDATE tasks SET (header, priority, cost, type, description, date_expected) = ($1, $2, $3, $4, $5, $6) WHERE creator_id = $7 AND id = $8',
   [header, priority, cost, type, description, date_expected, id, task_id],
   (error, result) => {
    if (error) {
      console.log(error)
      return res.status(400).send({success: false, message:'Server Error'})
    }
    return res.status(200).send({success: true, message:'Task Updated'})
  })
})

// Delete job entry
router.delete('/delete/:id', verify, function (req, res) {
  let info = req.body
  if (info.published && !info.accepted){
    pool.query('UPDATE users SET wallet=wallet+$1 WHERE id = $2', [info.cost, info.creator], (error, resulst) => {
      if (error){
        throw error
        return res.status(400).send({success: false, message:'Server Error'})
      }
    })
  }

  const task_id = parseInt(req.params.id)

  pool.query('DELETE FROM tasks WHERE id = $1', [task_id], (error, results) => {
    if (error) {
      throw error
      return res.status(400).send({success: false, message:'Server Error'})
    }
    return res.status(200).send({success: true, message:'Task Deleted'})
  })
})

module.exports = router
