//= require jquery
//= require jquery_ujs
//= require popper
//= require moment
//= require me/bootstrap/js/bootstrap

$(document).ready(function(){
  $('.read-more').on('click', function(e){
    e.preventDefault();

    $(this).parents('.content').html($(this).attr('data-replace'));

    $(this).hide();
  });

  $('.event-list').on('click', function(e){
    e.preventDefault();
    event_id = $(this).attr('data-event-id');
    $.ajax({
      url: '/events/'+event_id,
      dataFormat: 'js'
    });

  })
})