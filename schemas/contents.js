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
    ref:'Content'
  },
  //文章标题
  title: String,

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