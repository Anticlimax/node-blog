/**
 * Created by hasee on 2017/4/7.
 */
const express = require('express')
const router = express.Router()

router.get('/',(req,res,next)=>{

  console.log(req.userInfo)

  res.render('main/index',{
    userInfo:req.userInfo
  })
})

module.exports = router