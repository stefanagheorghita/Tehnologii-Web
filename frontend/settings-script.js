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
             subMenu.classList.toggle("open-menu");
             
        }
    
        //pt pagina settings
        const toggleSwitch = document.querySelector('#togg-1');
    
        toggleSwitch.addEventListener('change', function () {
            console.log("luminaa");
          document.body.classList.toggle('dark-mode');
        });
    
      
    
    });