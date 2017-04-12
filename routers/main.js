/**
 * Created by hasee on 2017/4/7.
 */
const express = require('express')
const router = express.Router()
const Category = require('../models/Category')

router.get('/',(req,res,next)=>{

  //  读取所有的分类信息
  Category.find().then((categories)=>{
    console.log(categories)
    res.render('main/index',{
      userInfo:req.userInfo,
      categories:categories
    })
  })


})

module.exports = router