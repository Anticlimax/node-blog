/**
 * Created by hasee on 2017/4/7.
 * 应用程序启动文件
 */

const express = require('express')
//加载模板
const swig = require('swig')

// http.createServer
const app = express()

//设置静态文件托管
//当用户访问的url以/public开始，那么直接返回对应__dirname + '/public'下的文件
app.use('/public', express.static(__dirname + '/public'))

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

//根据不同的功能划分模块
app.use('/admin',require('./routers/admin'))
app.use('/api',require('./routers/api'))
app.use('/main',require('./routers/main'))


app.listen(8080)

//用户发送http请求 -> 获得url -> 解析路由 -> 找到匹配的规则 -> 执行指定绑定函数 -> 返回内容给用户

// public开头 -> 静态文件 -> 读取指定目录下文件 -> 返回给用户
// 其他 -> 处理业务逻辑 -> 加载模板 解析模板 -> 返回给用户