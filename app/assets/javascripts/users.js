$.noConflict();

jQuery(document).ready(function($) {

  $('.password_confirmation').on('keyup', function(){
    password = $('.password').val();

    password_confirmation = $(this).val();

    if(password_confirmation != ''){
      if(password != password_confirmation){
        $(this).addClass('is-invalid').removeClass('is-valid');

        error =  "<div class='invalid-feedback invalid-password'>Les mots de passe ne concordent pas.</div>";

        if($('.invalid-password').length < 1){
          $(error).insertAfter(this);
        }
      }else{
        console.log("Match");
        $(this).addClass('is-valid').removeClass('is-invalid');
        $('.invalid-password').remove();
      }
    }
  });

  $('#toggle_password').on('change', function(){

    if($(this).is(':checked')){
      $('.password').attr('type', 'text');
      $('.password_confirmation').attr('type', 'text');
    }else{

      $('.password').attr('type', 'password');
      $('.password_confirmation').attr('type', 'password');
    }

  });

});