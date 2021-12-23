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
//= require tinymce-jquery
//= require activestorage
//= require fullcalendar
//= require fullcalendar/locale-all
//= require handlebars
//= require twitter/typeahead


$(document).ready(function(){

  $("[rel='tooltip']").tooltip();

  moment.locale('fr', {
    months : 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre'.split('_'),
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


  $('#menuToggle').on('click', function(event) {
    $('body').toggleClass('open');
  });

  tinyMCE.init({
    selector: 'textarea.tinymce',
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    toolbar: 'undo redo | formatselect | ' +
    'bold italic underline | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat | help',
  });

  $('.remove_fields').on('click', function(e){
    $(this).parents('.gratitude').fadeOut(500, function(){
      $(this).removeClass('d-flex').addClass('d-none');
    });
  });

  var pastors = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: '/users.json',
    remote: {
      url: '/users.json?query=%QUERY',
      wildcard: '%QUERY',
      filter: function (users) {
        return $.map(users, function (user) {
          console.log(user)
          return {
            id: user.id,
            value: user.firstname + ' ' + user.lastname
          };
        });
      }
    }
  });
  var husbands = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: '/users.json?husband=1',
    remote: {
      url: '/users.json?husband=1&query=%QUERY',
      wildcard: '%QUERY',
      filter: function (users) {
        return $.map(users, function (user) {
          console.log(user)
          return {
            id: user.id,
            value: user.firstname + ' ' + user.lastname
          };
        });
      }
    }
  });
  var wifes = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: '/users.json?wife=1',
    remote: {
      url: '/users.json?wife=1&query=%QUERY',
      wildcard: '%QUERY',
      filter: function (users) {
        return $.map(users, function (user) {
          console.log(user)
          return {
            id: user.id,
            value: user.firstname + ' ' + user.lastname
          };
        });
      }
    }
  });

  $('.referent').each(function(){
    $(this).typeahead({
        hint: true,
        highlight: true,
        minLength: 1
      },{
        name: 'pastors',
        source: pastors,
        display: 'value',
        limit: 50,
        templates: {
          suggestion: Handlebars.compile('<div class="pastor"><i class="fa fa-user mr-1"></i> {{value}}</div>')
        }
    }).bind('typeahead:select', function(ev, suggestion) {
      console.log(ev);
      console.log(suggestion);
      console.log($(this));

      $(this).parents('.form-group').find('input.referent_id').val(suggestion.id);
    });
  });

  $('.find_husband').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },{
      name: 'husbands',
      source: husbands,
      display: 'value',
      limit: 50,
      templates: {
        suggestion: Handlebars.compile('<div class="pastor"><i class="fa fa-user mr-1"></i> {{value}}</div>')
      }
  }).bind('typeahead:select', function(ev, suggestion) {
    console.log(ev);
    console.log(suggestion);
    console.log($(this));

    $("#husband_id").val(suggestion.id);
  });

  $('.find_wife').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },{
      name: 'wifes',
      source: wifes,
      display: 'value',
      limit: 50,
      templates: {
        suggestion: Handlebars.compile('<div class="pastor"><i class="fa fa-user mr-1"></i> {{value}}</div>')
      }
  }).bind('typeahead:select', function(ev, suggestion) {
    console.log(ev);
    console.log(suggestion);
    console.log($(this));

    $("#wife_id").val(suggestion.id);
  });


  $('.church').each(function(){
    init_church($(this));
  });

  $('.select_all_access').on('click', function(e){
    e.preventDefault();

    $('.form-check-input').each(function(){
      $(this).attr('checked', true);
    });
  });

  $('#phases').on('cocoon:after-insert', function(e, insertedItem, originalEvent){
    init_church(insertedItem.find('.church'));
  });

  $('#responsabilities').on('cocoon:after-insert', function(e, insertedItem, originalEvent){
    init_assoc(insertedItem.find('.association'));
  });


});

function init_church(element){
  var churches = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: '/structures.json?type=church',
    remote: {
      url: '/structures.json?type=church&query=%QUERY',
      wildcard: '%QUERY',
      filter: function (structures) {
        return $.map(structures, function (structure) {
          console.log(structure)
          return {
            id: structure.id,
            value: structure.name + ' (' + structure.town + ')'
          };
        });
      }
    }
  });

  element.typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },{
      name: 'churches',
      source: churches,
      display: 'value',
      limit: 50,
      templates: {
        suggestion: Handlebars.compile('<div class="church"><i class="fa fa-fire mr-1"></i> {{value}}</div>')
      }
  }).bind('typeahead:select', function(ev, suggestion) {

    element.parents('.form-group').find('input.church_id').val(suggestion.id);
  });
}
function init_assoc(element){
  var associations = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: '/structures.json?type=association',
    remote: {
      url: '/structures.json?type=association&query=%QUERY',
      wildcard: '%QUERY',
      filter: function (structures) {
        return $.map(structures, function (structure) {
          console.log(structure)
          return {
            id: structure.id,
            value: structure.name
          };
        });
      }
    }
  });

  element.typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },{
      name: 'associations',
      source: associations,
      display: 'value',
      limit: 50,
      templates: {
        suggestion: Handlebars.compile('<div class="church"><i class="fa fa-fire mr-1"></i> {{value}}</div>')
      }
  }).bind('typeahead:select', function(ev, suggestion) {

    element.parents('.form-group').find('input.association_id').val(suggestion.id);
  });
}

function init_fullCalendar(selector, sources, selectable){
  $(selector).fullCalendar({
    locale: 'fr',
    themeSystem: 'bootstrap4',
    selectable: selectable,
    eventSources: sources,

    select: function(startDate, endDate){
      $.ajax({
        url: '/events/new.js',
        data: {start_at: startDate.format(), end_at: endDate.format()}
      });
    },

    eventClick: function(calEvent, jsEvent, view) {
      jsEvent.preventDefault();
      $.ajax({
        url: calEvent.url
      });
    }

  });
}