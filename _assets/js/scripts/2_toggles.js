//Toggle Content
$('.toggle-click').on("click", function(){
  $(this).toggleClass('active');
  $(this).next('.toggle-content').toggleClass('active');
});
