/**
 * Created by hasee on 2017/4/7.
 */


$(function () {

  var $loginBox = $('#loginBox')
  var $registerBox = $('#registerBox')
  var $userInfo = $('#userInfo')

  $loginBox.find('.info').find('a').on('click', function (e) {
    e.preventDefault()
    $loginBox.hide()
    $registerBox.show()
  })

  $registerBox.find('.info').find('a').on('click', function (e) {
    e.preventDefault()
    $registerBox.hide()
    $loginBox.show()
  })

//注册
  $registerBox.find('.btn').find('a').on('click', function (e) {
    e.preventDefault()
    $.ajax({
      url: '/api/user/register',
      type: 'post',
      data: {
        username: $registerBox.find('.username').val(),
        password: $registerBox.find('.password').val(),
        repassword: $registerBox.find('.repassword').val()
      },
      dataTypes: 'json'
    }).then(function (result) {
      $registerBox.find('.warning').html(result.message)
      if (!result.code) {
        //注册成功
        setTimeout(function () {
          $registerBox.hide()
          $loginBox.show()
        }, 500)
      }
    })
  })

//登陆
  $loginBox.find('.btn').find('a').on('click', function (e) {
    e.preventDefault()
    $.ajax({
      url: '/api/user/login',
      type: 'post',
      data: {
        username: $loginBox.find('.username').val(),
        password: $loginBox.find('.password').val()
      },
      dataTypes: 'json'
    }).then(function (result) {
      $loginBox.find('.warning').html(result.message)
      if (!result.code) {
        //登陆成功
        window.location.reload()
      }
    })
  })

//退出
  $userInfo.find('.logout').on('click',function (e) {
    e.preventDefault()
    $.ajax({
      url:'api/user/logout'
    }).then(function () {
      window.location.reload()
    })
  })

})