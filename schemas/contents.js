/**
 * Created by hasee on 2017/4/12.
 */

const mongoose = require('mongoose')

//文章的表结构
module.exports =  new mongoose.Schema({

  //关联字段 - 内容id
  category:{
    //类型
    type:mongoose.Schema.Types.ObjectId,
    //引用
    ref:'Category'
  },

  //关联字段 - 用户id
  user:{
    //类型
    type:mongoose.Schema.Types.ObjectId,
    //引用
    ref:'User'
  },

  //文章标题
  title: String,

  //创建时间
  addTime:{
    type: Date,
    default: new Date()
  },

  //阅读量
  views:{
    type: Number,
    default:0
  },

  //简介
  description:{
    type:String,
    default:''
  },

  //文章内容
  content:{
    type:String,
    default:''
  }
})