/**
 * Created by hasee on 2017/4/7.
 */

const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.use((req,res,next)=>{
  if(!req.userInfo.isAdmin){
    res.send('对不起，只有管理员才可以进入后台管理系统')
    return
  }
  next()
})

//首页
router.get('/',(req,res,next)=>{
  res.render('admin/index',{
    userInfo : req.userInfo
  })
})

//用户管理
router.get('/user',(req,res,next)=>{
  User.find().then((users)=>{
    res.render('admin/user_index',{
      userInfo:req.userInfo,
      users:users
    })
  })
})
module.exports = router