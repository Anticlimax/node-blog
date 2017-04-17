/**
 * Created by hasee on 2017/4/7.
 */
const express = require('express')
const router = express.Router()
const Category = require('../models/Category')
const Content = require('../models/Content')

let data = {}


//通用数据
router.use((req,res,next)=>{

  data.userInfo = req.userInfo


  Category.find().then((categories)=>{

    data.categories = categories
    next()
  })
})

//首页
router.get('/', (req, res, next) => {

  data.category = req.query.category || ''
  data.count = 0
  data.page = Number(req.query.page || 1)
  data.limit = 2
  data.pages = 0

  let where = {}

  if (data.category){
    where.category = data.category
  }


  //  读取所有的分类信息
  Content.where(where).count().then((count) => {

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
    res.render('main/index', data)
  })


})

router.get('/views',(req,res)=>{
  let contentid = req.query.contentid || ''

  Content.findOne({
    _id:contentid
  }).then((content)=>{
    data.content = content

    content.views++
    content.save()

    res.render('main/view',data)
  })
})


module.exports = router