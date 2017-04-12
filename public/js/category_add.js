/**
 * Created by hasee on 2017/4/12.
 */


$(function () {
  var submit = $('.addCategoryBtn')
  console.log(submit)
  submit.on('click',function () {
    $.ajax({
      url:'/category/add',
      method:'POST',
      dataTypes:'json',
      contentType:'application/json',
      data:{
        name:$('.addCategory').val()
      }
    }).then((e)=>{
      console.log(1)
    })
  })
})