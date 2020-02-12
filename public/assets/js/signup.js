$( document ).ready(function() {
    $(".form-2").hide();
    $(".form-3").hide();
});

$( "#submit-1" ).click(function() {
    $(".form-1").hide();
    $(".form-2").show();
  });

  $( "#submit-2" ).click(function() {
    $(".form-2").hide();
    $(".form-3").show();
  });

  $( "#previous-1" ).click(function() {
    $(".form-1").show();
    $(".form-2").hide();
  });

  $( "#previous-2" ).click(function() {
    $(".form-2").show();
    $(".form-3").hide();
  });