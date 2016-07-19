function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}

r(function(){
  var alerts = document.getElementsByClassName("alert");

  for(var i = 0; i < alerts.length; i++) {
      var element = alerts[i];
      element.addEventListener("click", function (event) {
        event.target.style.opacity = 0;
        setTimeout(function () { event.target.remove(); }, 400);
      });
  }

  document.getElementById("hamburger").addEventListener("click", function() {
    document.getElementById("nav-content").classList.toggle("show");
  });
});
