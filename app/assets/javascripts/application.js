// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require popper
//= require bootstrap
//= require select2
//= require_tree .

$.noConflict();

jQuery(document).ready(function($) {

  "use strict";


  $('#menuToggle').on('click', function(event) {
    $('body').toggleClass('open');
  });

  $('.search-trigger').on('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    $('.search-trigger').parent('.header-left').addClass('open');
  });

  $('.search-close').on('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    $('.search-trigger').parent('.header-left').removeClass('open');
  });

  $('.users-select2').select2({
      theme: "bootstrap",
      minimumInputLength: 2,
      language: {
        inputTooShort: function () {
          return "Merci d'entrer au moins 2 lettres...";
        }
      },
      ajax: {
        url: '/users.json',
        dataType: 'json',
        data: function (params) {
          var query = {
            search: params.term
          }
          return query;
        },
        processResults: function (data) {
          return {
            results: $.map(data, function(item) {
              return {
                text: item.firstname + " " + item.lastname,
                id: item.id
              }
            })
          };
        }
      },
      templateResult: function(object) {
        $("#structure_has_memberships_is_memberable_id").val(object.id);
        return object.text;
      }
  });

  $('.change_role').on('click', function(e){
    e.preventDefault();

    var url = $(this).attr('href');
    $.ajax({
      url: url,
      success: function(result){
        console.log(result);
        $('#roles_form .modal-body').html(result);
        $('#roles_form').modal('show');
      }
    });
  })

});