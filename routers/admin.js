/**
 * Created by hasee on 2017/4/7.
 */

const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Category = require('../models/Category')

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
    page = Math.min(page, pages)
    //取值不能小于1
    page = Math.max(page, 1)

    let skip = (page - 1) * limit

    User.find().limit(limit).skip(skip).then((users) => {
      res.render('admin/user_index', {
        userInfo: req.userInfo,
        users: users,
        count: count,
        pages: pages,
        limit: limit,
        page: page
      })
    })
  })
})

//分类首页
router.get('/category', (req, res) => {
  let page = Number(req.query.page || 1)
  const limit = 3
  let pages = 0
  //计算总条数
  Category.count().then((count) => {

    //计算总页数
    pages = Math.ceil(count / limit)
    //取值不能大于pages
    page = Math.min(page, pages)
    //取值不能小于1
    page = Math.max(page, 1)

    let skip = (page - 1) * limit

    Category.find().limit(limit).skip(skip).then((categories) => {
      res.render('admin/category_index', {
        userInfo: req.userInfo,
        categories: categories,
        count: count,
        pages: pages,
        limit: limit,
        page: page
      })
    })
  })
})

//添加分类
router.get('/category/add', (req, res) => {
  res.render('admin/category_add', {
    userInfo: req.userInfo
  })
})

//分类保存
router.post('/category/add', (req, res) => {

  const name = req.body.name || ''

  if (name === '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '名称不能为空'
    })
    return
  }

  //数据中是否已经存在同名分类
  Category.findOne({
    name: name
  }).then((rs) => {
    if (rs) {
      //数据库中已经存在该分类
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '分类名已经存在'
      })
      return Promise.reject()
    } else {
      //数据库中不存在该分类，可以保存
      return new Category({
        name: name
      }).save()
    }
  }).then((newCategory) => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '分类保存成功',
      url: '/admin/category'
    })
  })

})

//分类编辑
router.get('/category/edit',(req,res)=>{

  //获取要修改的分类信息，并且用表单形式展现
  const id = req.query.id || ''

  Category.findOne({
    _id:id
  }).then((category)=>{
    if(!category){
      console.log(category)
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'分类信息不存在'
      })
    } else {
      res.render('admin/category_edit',{
        userInfo:req.userInfo,
        category:category
      })
    }

  })
})

//分类的修改保存
router.post('/category/edit',(req,res)=>{
  const id = req.query.id || ''
  const name = req.body.name || ''

  Category.findOne({
    _id:id
  }).then((category)=>{
    if(!category){
      console.log(category)
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'分类信息不存在'
      })
      return Promise.reject()
    } else {
      //当用户没有做任何修改
      if(name === category.name){
        res.render('admin/success',{
          userInfo:req.userInfo,
          message:'保存成功',
          url:'/admin/category'
        })
        return Promise.reject()
      } else {
        //要修改的分类名称是否已经在数据库中存在
        return Category.findOne({
          _id:{$ne:id},
          name:name
        })
      }
    }
  }).then((sameCategory)=>{
    if(sameCategory){
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'已有同名分类'
      })
      return Promise.reject()
    } else {
      return Category.update({
        _id:id
      },{
        name:name
      })
    }
  }).then(()=>{
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'保存成功',
      url:'/admin/category'
    })
  })
})

//分类删除
router.get('/category/delete',(req,res)=>{
  const id = req.query.id || ''

  Category.remove({
    _id:id
  }).then(()=>{
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'删除成功',
      url:'/admin/category'
    })
  })
})


module.exports = router