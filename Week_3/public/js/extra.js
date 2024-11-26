
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.collapsible');
  var elems = document.querySelectorAll('.carousel');
  var instances = M.Collapsible.init(elems, options);
});

  $(document).ready(function(){
    $('.collapsible').collapsible();
    $('.modal').modal();
    $('.carousel').carousel();

    // change button css
    $('#change-colour-btn').click(function(){
        $(this).css("background-color", "white");
        $(this).css("color", "black");
        
    });
  });