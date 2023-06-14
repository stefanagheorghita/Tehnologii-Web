document.addEventListener("DOMContentLoaded", function() {

//pentru meniu icon
let navbar = document.querySelector(".header .navigation_bar");
let menuBtn = document.querySelector('#menu-btn');

menuBtn.addEventListener('click', function() {

navbar.classList.toggle('active');
menuBtn.classList.toggle("active");
});

//pentru profile icon
let userIcon = document.getElementById("userIcon");
 let subMenu = document.getElementById("subMenu")
 let prf = document.querySelector(".profile_icon_container-2");
 prf.addEventListener("click", toggleMenu);  
    userIcon.addEventListener("click", toggleMenu);
    
    function toggleMenu() {
        console.log("efgrtdhf");
        var token = localStorage.getItem('token') || getCookie('token');
        if(token)
         {subMenu.classList.toggle("open-menu");
         document.getElementById('logoutLink').addEventListener('click', logout);}
        else
        {
            window.location.href = "/login.html";
        }
    }
  
});

function logout() {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('token');
  window.location.href = 'landingpage.html';
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }