/**
 * Created by hasee on 2017/4/7.
 */
const express = require('express')
const router = express.Router()

router.get('/user',(req,res,next)=>{
  res.send('API - User')
})

module.exports = router