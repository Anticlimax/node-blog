/**
 * Created by hasee on 2017/4/7.
 */

const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.use((req, res, next) => {
  if (!req.userInfo.isAdmin) {
    res.send('对不起，只有管理员才可以进入后台管理系统')
    return
  }
  next()
})

//首页
router.get('/', (req, res, next) => {
  res.render('admin/index', {
    userInfo: req.userInfo
  })
})

//用户管理
//limit(num)：限制获取的数据条数
//skip(num):忽略数据的条数


router.get('/user', (req, res, next) => {
  let page = Number(req.query.page || 1)
  const limit = 3
  let pages = 0
  //计算总条数
  User.count().then((count) => {

    //计算总页数
    pages = Math.ceil(count / limit)
    //取值不能大于pages
    page = Math.min( page, pages)
    //取值不能小于1
    page = Math.max( page, 1 )

    let skip = (page - 1) * limit

    User.find().limit(limit).skip(skip).then((users) => {
      res.render('admin/user_index', {
        userInfo: req.userInfo,
        users: users,
        count:count,
        pages:pages,
        limit:limit,
        page: page
      })
    })
  })


})
module.exports = router