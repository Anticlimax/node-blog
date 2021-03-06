/**
 * Created by hasee on 2017/4/7.
 */

const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Category = require('../models/Category')
const Content = require('../models/Content')


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
  const limit = 5
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
        page: page,
        type:'user'
      })
    })
  })
})

//分类首页
router.get('/category', (req, res) => {
  let page = Number(req.query.page || 1)
  const limit = 5
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

    // sort 方法取值 1：升序，-1：降序 _id这个值默认是带时间戳的 所以后添加总比
    //先添加大  我们需要降序排列

    Category.find().sort({_id: -1}).limit(limit).skip(skip).then((categories) => {
      res.render('admin/category_index', {
        userInfo: req.userInfo,
        categories: categories,
        count: count,
        pages: pages,
        limit: limit,
        page: page,
        type:'category'
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
router.get('/category/edit', (req, res) => {

  //获取要修改的分类信息，并且用表单形式展现
  const id = req.query.id || ''

  Category.findOne({
    _id: id
  }).then((category) => {
    if (!category) {
      console.log(category)
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '分类信息不存在'
      })
    } else {
      res.render('admin/category_edit', {
        userInfo: req.userInfo,
        category: category
      })
    }

  })
})

//分类的修改保存
router.post('/category/edit', (req, res) => {
  const id = req.query.id || ''
  const name = req.body.name || ''

  Category.findOne({
    _id: id
  }).then((category) => {
    if (!category) {
      console.log(category)
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '分类信息不存在'
      })
      return Promise.reject()
    } else {
      //当用户没有做任何修改
      if (name === category.name) {
        res.render('admin/success', {
          userInfo: req.userInfo,
          message: '保存成功',
          url: '/admin/category'
        })
        return Promise.reject()
      } else {
        //要修改的分类名称是否已经在数据库中存在
        return Category.findOne({
          _id: {$ne: id},
          name: name
        })
      }
    }
  }).then((sameCategory) => {
    if (sameCategory) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '已有同名分类'
      })
      return Promise.reject()
    } else {
      return Category.update({
        _id: id
      }, {
        name: name
      })
    }
  }).then(() => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '保存成功',
      url: '/admin/category'
    })
  })
})

//分类删除
router.get('/category/delete', (req, res) => {
  const id = req.query.id || ''

  Category.remove({
    _id: id
  }).then(() => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '删除成功',
      url: '/admin/category'
    })
  })
})

//内容首页
router.get('/content', (req, res) => {
  let page = Number(req.query.page || 1)
  const limit = 5
  let pages = 0
  //计算总条数
  Content.count().then((count) => {

    //计算总页数
    pages = Math.ceil(count / limit)
    //取值不能大于pages
    page = Math.min(page, pages)
    //取值不能小于1
    page = Math.max(page, 1)

    let skip = (page - 1) * limit

    // sort 方法取值 1：升序，-1：降序 _id这个值默认是带时间戳的 所以后添加总比
    //先添加大  我们需要降序排列

    Content.find().sort({_id: -1}).limit(limit).skip(skip).populate(['category','user']).then((contents) => {
      res.render('admin/content_index', {
        userInfo: req.userInfo,
        contents: contents,
        count: count,
        pages: pages,
        limit: limit,
        page: page,
        type:'content'
      })
    })
  })
})

//内容添加
router.get('/content/add', (req, res) => {

  Category.find().sort({_id: -1}).then((categories) => {
    res.render('admin/content_add', {
      userInfo: req.userInfo,
      categories: categories
    })
  })
})

//内容提交
router.post('/content/add', (req, res) => {

  if (req.body.title === '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '标题不能为空'
    })
    return
  }

  new Content({
    category: req.body.category,
    title: req.body.title,
    user: req.userInfo._id.toString(),
    description: req.body.description,
    content: req.body.content
  }).save().then((rs) => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '内容保存成功',
      url: '/admin/content'
    })
  })
})

//内容编辑
router.get('/content/edit', (req, res) => {
  const id = req.query.id || ''
  let categories = []

  Category.find().sort({_id: -1}).then((rs) => {
    categories = rs
    return Content.findOne({
      _id: id
    }).populate('category')
  }).then((content) => {
    if (!content) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '指定内容不存在'
      })
      return Promise.reject()
    } else {
      res.render('admin/content_edit', {
        userInfo: req.userInfo,
        content: content,
        categories: categories
      })
    }
  })
})

//保存修改内容
router.post('/content/edit', (req, res) => {
  const id = req.query.id || ''

  if (req.body.title === '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '标题不能为空'
    })
    return
  }

  Content.update({
    _id:id
  },{
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    content: req.body.content
  }).then(()=>{
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'内容保存成功',
      url:'/admin/content'
    })
  })
})

//内容删除
router.get('/content/delete',(req,res)=>{
  const id = req.query.id || ''

  Content.remove({
    _id:id
  }).then(() => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '删除成功',
      url: '/admin/content'
    })
  })

})

module.exports = router