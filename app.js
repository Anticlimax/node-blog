/**
 * Created by hasee on 2017/4/7.
 * 应用程序启动文件
 */

const express = require('express')
//加载模板
const swig = require('swig')

// http.createServer
const app = express()

// //加载body-parse处理前端post过来的数据
const bodyParser = require('body-parser')

//加载cookies模块
const Cookies = require('cookies')

const mongoose = require('mongoose')

const User = require('./models/User')

//设置静态文件托管
//当用户访问的url以/public开始，那么直接返回对应__dirname + '/public'下的文件
app.use('/public', express.static(__dirname + '/public'))

//设置cookies
app.use((req, res, next) => {
  req.cookies = new Cookies(req, res)
  //解析登陆用户的cookies信息
  req.userInfo = {}

  //如果cookies存在，将其挂载到req上
  if (req.cookies.get('userInfo')) {
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'))

      //获取当前登陆用户的类型，是否是管理员
      User.findById(req.userInfo._id).then((userInfo) => {
        req.userInfo.isAdmin = Boolean(userInfo.isAdmin)
        next()
      })
    } catch (e) {
      next()
    }
  }else {
    next()
  }
})

//配置应用模板
//定义当前使用的模板引擎
//第一个参数，模板引擎的名称，也是模板文件的后缀，第二个参数表示用于解析模板引擎的方法
app.engine('html', swig.renderFile)

//设置模板文件存放的目录，第一个参数必须为views，第二个参数为对应目录
app.set('views', './views')

//注册所使用的的模板引擎,第一个参数必须是view engine 第二个参数必须和app.engine中的参数一致
app.set('view engine', 'html')

//在开发过程中，需要取消模板缓存
swig.setDefaults({cache: false})

app.use(bodyParser.urlencoded({extended: true}))
//根据不同的功能划分模块
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))

mongoose.connect('mongodb://localhost:27017/blog', (err) => {
  if (err) {
    console.log('数据库连接失败')
  } else {
    console.log('数据库连接成功')
    app.listen(8080)
  }
})

//用户发送http请求 -> 获得url -> 解析路由 -> 找到匹配的规则 -> 执行指定绑定函数 -> 返回内容给用户

// public开头 -> 静态文件 -> 读取指定目录下文件 -> 返回给用户
// 其他 -> 处理业务逻辑 -> 加载模板 解析模板 -> 返回给用户