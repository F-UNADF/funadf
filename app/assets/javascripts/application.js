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
//= require moment
//= require bootstrap
//= require select2
//= require tempusdominus-bootstrap-4
//= require cocoon
//= require bootstrap-toggle
//= require toastr
//= require_tree .

$.noConflict();

jQuery(document).ready(function($) {

  "use strict";
  $("[rel='tooltip']").tooltip();

  $('input.switch').bootstrapToggle({
    on: 'Oui',
    off: 'Non',
    size: 'small',
    onstyle: 'success',
    offstyle: 'danger'
  }).change(function() {
    var url = '/structures/' + $(this).data('structure') + '/resource/' + $(this).data('resource-id') + '/' + $(this).data('resource-type');
    var selector = '.reason-' + $(this).data('resource-id');

    var $this = $(this);
    console.log(selector);
    $.ajax({
      url: url,
      method: "post",
      data: {can_vote: $(this).prop('checked')},
      success: function(data){
        console.log(data.updated);
        if (data.updated=='ok'){
          toastr.success('Membre mis à jour');
          console.log($(selector));
          console.log($(this).prop('checked'));
          if($this.prop('checked')){
            $(selector).addClass('d-none');
          }else{
            $(selector).removeClass('d-none');
          }
        }else{
          toastr.danger('Une erreur est survenue');
        }
      }
    });
  });

  $('.select-reason').on('change', function(e){
    var url = '/structures/' + $(this).data('structure') + '/reason/' + $(this).data('resource-id') + '/' + $(this).data('resource-type');

    $.ajax({
      url: url,
      method: "post",
      data: {reason: $(this).val()},
      success: function(data){
        console.log(data.updated);
        if (data.updated=='ok'){
          toastr.success('Raison mise à jour');
        }else{
          toastr.danger('Une erreur est survenue');
        }
      }
    });
  })


  moment.locale('fr', {
    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact : true,
    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Aujourd’hui à] LT',
        nextDay : '[Demain à] LT',
        nextWeek : 'dddd [à] LT',
        lastDay : '[Hier à] LT',
        lastWeek : 'dddd [dernier à] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dans %s',
        past : 'il y a %s',
        s : 'quelques secondes',
        m : 'une minute',
        mm : '%d minutes',
        h : 'une heure',
        hh : '%d heures',
        d : 'un jour',
        dd : '%d jours',
        M : 'un mois',
        MM : '%d mois',
        y : 'un an',
        yy : '%d ans'
    },
    dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'e');
    },
    meridiemParse : /PD|MD/,
    isPM : function (input) {
        return input.charAt(0) === 'M';
    },
    // In case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example).
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
  });

  $('.datetimepicker').datetimepicker({
    format: "DD/MM/YYYY - HH:mm",
    locale: 'fr',
    autoclose: true,
    minuteStep: 30,
    use24hours: true,
    useCurrent: true
  });

  $('.remove_fields').click(function(){
    $(this).parents('tr').fadeOut();
  });
  $('#motions').on('cocoon:after-insert', function(e, insertedItem, originalEvent) {
    insertedItem.find('a.remove_fields').click(function(){
      $(this).parents('tr').fadeOut();
    });
  });

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
  });


  $('.submit-vote').on('click', function(){

    var has_voter = false;

    $('.voter_check').each(function(){
      console.log(!has_voter && $(this).is(':checked'));
      if(!has_voter && $(this).is(':checked')){
        has_voter = true;
      }
    });

    if(has_voter){
      if(confirm('Attention, une fois le vote effectué, il est impossible de revenir en arrière ! Merci de bien vérifier votre vote avant de valider !')){
        return true;
      }
    }else{
      alert("Pour valider ce bulletin, merci de selectionner au moins une qualité de vote. S'il ne vous reste plus de qualité, vous ne pouvez pas voter.");
      return false;
    }
  })

});