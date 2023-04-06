document.addEventListener("DOMContentLoaded", function() {let navbar = document.querySelector(".header .navigation_bar");
let menuBtn = document.querySelector('#menu-btn');

menuBtn.addEventListener('click', function() {

navbar.classList.toggle('active');
menuBtn.classList.toggle("active");
});

});