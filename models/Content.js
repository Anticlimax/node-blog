/**
 * Created by hasee on 2017/4/7.
 */

const mongoose = require('mongoose')

const contentsSchema = require('../schemas/contents' )

//定义一个model类 用于对用户的表进行操作
module.exports =  mongoose.model('Content', contentsSchema)