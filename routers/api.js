/**
 * Created by hasee on 2017/4/7.
 */
const express = require('express')
const router = express.Router()
const User = require('../models/User')

//统一返回格式
let responseData = {}

router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ''
  }
  next()
})

//用户注册
//注册逻辑
// 1.用户名不能为空，2.密码不能为空,3.用户名是否已被注册

router.post('/user/register', (req, res, next) => {

  const username = req.body.username
  const password = req.body.password
  const repassword = req.body.repassword

  //用户名是否为空
  if (username === '') {
    responseData.code = 1
    responseData.message = '用户名不能为空'
    res.json(responseData)
    return
  }

  //密码不能为空
  if (password === '') {
    responseData.code = 2
    responseData.message = '密码不能为空'
    res.json(responseData)
    return
  }

  //两次输入密码不一致
  if (password !== repassword) {
    responseData.code = 3
    responseData.message = '两次输入密码不一一致'
    res.json(responseData)
    return
  }

  //用户名是否已经被注册,如果数据库中已经存在同名数据，表示该用户名已经被注册
  User.findOne({
    username: username
  }).then((userInfo) => {
    if (userInfo) {
      //表示数据库中存在该记录
      responseData.code = 4
      responseData.message = '用户名已经被注册'
      res.json(responseData)
      return
    }
    //将用户注册的信息保存到数据库
    const user = new User({
      username: username,
      password: password
    })
    return user.save()
  }).then((newUserInfo) => {
    console.log(newUserInfo)
    responseData.message = '注册成功'
    res.json(responseData)
  })


})

//登陆
router.post('/user/login', (req, res) => {
  let username = req.body.username
  let password = req.body.password

  if (username === '' || password === '') {
    responseData.code = 1
    responseData.message = '用户名或密码不能为空'
    res.json(responseData)
    return
  }

  //查询数据库中相同用户名和密码记录是否存在,存在则登陆成功
  User.findOne({
    username: username,
    password: password
  }).then((userInfo) => {
    if (!userInfo) {
      responseData.code = 2
      responseData.message = '用户名或密码错误'
      res.json(responseData)
      return
    }
    //用户名和密码是正确的
    responseData.message = '登陆成功'
    responseData.userInfo = {
      _id: userInfo.id,
      username: userInfo.username
    }
    req.cookies.set('userInfo', JSON.stringify(responseData.userInfo))
    res.json(responseData)
    return
  })
})

//登出
router.get('/user/logout', (req, res) => {
  req.cookies.set('userInfo',null)
  res.json(responseData)
})

module.exports = router