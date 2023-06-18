function isTokenExpired(token) {
    const currentTime = Date.now();
    const expirationTime = localStorage.getItem('tokenExpires');
    const expirationTimestamp = new Date(expirationTime).getTime();
    return expirationTimestamp < currentTime;
  }
  
  document.addEventListener("DOMContentLoaded", function() {
  
    // Redirect to login page if not logged in and clicking on the Settings link
    let settingsLink = document.getElementById("a2");
    if (settingsLink) {
      settingsLink.addEventListener("click", function(event) {
        var token = localStorage.getItem('token');
        if (!token || isTokenExpired(token)) {
          event.preventDefault();
          window.location.href = "/login.html";
        }
      });
    }
    
  });
  
  