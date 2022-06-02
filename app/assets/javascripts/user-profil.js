//= require handlebars
//= require twitter/typeahead

jQuery(document).ready(function($) {

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
    init_referent($(this))
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

  $('#phases').on('cocoon:after-insert', function(e, insertedItem, originalEvent){
    init_church(insertedItem.find('.church'));
  });

  $('#responsabilities').on('cocoon:after-insert', function(e, insertedItem, originalEvent){
    init_assoc(insertedItem.find('.association'));
  });

  $('#gratitudes').on('cocoon:after-insert', function(e, insertedItem, originalEvent){
    init_referent(insertedItem.find('.referent'));
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
        return jQuery.map(structures, function (structure) {
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

function init_referent(elem){

  var pastors = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: '/users.json',
    remote: {
      url: '/users.json?query=%QUERY',
      wildcard: '%QUERY',
      filter: function (users) {
        console.log(users)
        return jQuery.map(users, function (user) {
          return {
            id: user.id,
            value: user.firstname + ' ' + user.lastname
          };
        });
      }
    }
  });

  elem.typeahead({
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
    console.log(elem);

    elem.parents('.form-group').find('input.referent_id').val(suggestion.id);
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
        console.log(structures)
        return jQuery.map(structures, function (structure) {
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
        suggestion: Handlebars.compile('<div class="church"><i class="fa fa-building mr-1"></i> {{value}}</div>')
      }
  }).bind('typeahead:select', function(ev, suggestion) {

    element.parents('.form-group').find('input.association_id').val(suggestion.id);
  });
}