function isTokenExpired(token) {
     const currentTime = Date.now();
  const expirationTime = localStorage.getItem('tokenExpires');
  const expirationTimestamp =  new Date(expirationTime).getTime();
    return expirationTimestamp < currentTime;
  }

document.addEventListener("DOMContentLoaded", function () {

//pentru meniu icon
    let navbar = document.querySelector(".header .navigation_bar");
    let menuBtn = document.querySelector('#menu-btn');

    menuBtn.addEventListener('click', function () {

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

        var token = localStorage.getItem('token');
        if (token && !isTokenExpired(token)) {
            subMenu.classList.toggle("open-menu");
            document.getElementById('logoutLink').addEventListener('click', logout);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpires');
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
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}
  