
$('.messageBtn').on('click',function () {
  $.ajax({
    type:'POST',
    url:'/api/comment/post',
    data:{
      contentid:$('#contentId').val(),
      content:$('.messageContent').val()
    }
  }).then(function (responseData) {
    $('.messageContent').val('')
    renderComment(responseData.data.comments)
  })
})

function renderComment(data) {
  var html = ''
  data.reverse().forEach(function (item, index) {
    html += '<li>' +
      '<div><span>' + item.username + '</span><span>' + item.postTime + '</span></div>' +
      '<div>' + item.content + '</div>' +
      '</li>'
  })
  $('.messageList').html(html)
}