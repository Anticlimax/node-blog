/**
 * Created by hasee on 2017/4/7.
 */
const express = require('express')
const router = express.Router()
const Category = require('../models/Category')
const Content = require('../models/Content')

//首页

router.get('/', (req, res, next) => {

  let data = {
    userInfo: req.userInfo,
    category: req.query.category || '',
    categories: [],
    count: 0,
    page: Number(req.query.page || 1),
    limit: 2,
    pages: 0
  }

  let where = {}

  if (data.category){
    where.category = data.category
  }


  //  读取所有的分类信息
  Category.find().then((categories) => {

    data.categories = categories

    return Content.where(where).count()

  }).then((count) => {

    data.count = count

    //计算总页数
    data.pages = Math.ceil(data.count / data.limit)
    //取值不能大于pages
    data.page = Math.min(data.page, data.pages)
    //取值不能小于1
    data.page = Math.max(data.page, 1)

    let skip = (data.page - 1) * data.limit

    return Content.where(where).find().sort({_id: -1}).limit(data.limit).skip(skip).populate(['category', 'user'])

  }).then((content) => {

    data.contents = content
    console.log(data)
    res.render('main/index', data)
  })


})

module.exports = router