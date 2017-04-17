var perpage = 2
var page = 1
var pages = 0
var comments = []

//提交评价
$('.messageBtn').on('click', function () {
  $.ajax({
    type: 'POST',
    url: '/api/comment/post',
    data: {
      contentid: $('#contentId').val(),
      content: $('.messageContent').val()
    }
  }).then(function (responseData) {
    $('.messageContent').val('')
    comments = responseData.data.comments.reverse()
    renderComment()
  })
})

//每次页面重载的时候获取文章的所有评论
$.ajax({
  url: '/api/comment',
  data: {
    contentid: $('#contentId').val()
  }
}).then(function (responseData) {
  comments = responseData.data.reverse()
  renderComment()
})

//事件代理，处理分页按钮
var $commentsBtn = $('.message .commentsBtn')
$commentsBtn.on('click', 'a', function () {
  if ($(this).parent().hasClass('pre')) {
    page--
  } else {
    page++
  }
  renderComment()
})

function renderComment() {

  if(comments.length === 0){
    $('.messageList').html('还没有评论')
  } else {
    $('.messageCount').html(comments.length)

    pages = Math.ceil(comments.length / perpage)
    var start = Math.max((page - 1) * perpage, 1)
    var end = Math.min(start + perpage, comments.length)


    var $commentsPage = $('.commentsPage')


    if (page <= 1) {
      page = 1
      $('.pre').html('没有上一页了')
    } else {
      $('.pre').html('<a href="#">上一页</a>')
    }
    if (page >= pages) {
      page = pages
      $('.next').html('没有下一页了')
    } else {
      $('.next').html('<a href="#">下一页</a>')
    }
    $commentsPage.html(page + '/' + pages)


    var html = ''
    for (var i = start; i < end; i++) {
      html += '<li>' +
        '<div><span>' + comments[i].username + '</span><span>' + formatDate(comments[i].postTime) + '</span></div>' +
        '<div>' + comments[i].content + '</div>' +
        '</li>'
    }
    $('.messageList').html(html)
  }


}

function formatDate(d) {
  var data = new Date(d)
  return data.getFullYear() + '年' + (data.getMonth() + 1) + '月' +
    data.getDate() + '日' + data.getHours() + ':' +
    data.getMinutes() + ':' + data.getSeconds()
}