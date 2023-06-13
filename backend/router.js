const fs = require('fs');
const path = require('path');
const { handleLandingPage, handleLoginPage, handleHomePage, handleRegisterPage, handleStaticFile } = require('./handler'); ////
const { handleLoginRequest } = require('./login');
const { handleRegisterRequest } = require('./register'); ////

function router(req, res) {
  const url = req.url;
  if (url === '/' || url === '/landingpage.html' || url === '/landingpage') {
    handleLandingPage(req, res);
  } else if (url === '/login' || url === '/user-account/login.html' || url === '/login.html' ) {
    if (req.method === 'POST') {
      handleLoginRequest(req, res); 
    } else {
      handleLoginPage(req, res);
    }
  }
  else if(url==='/home' || url==='/index.html' || url==='/index')
  {
    handleHomePage(req,res);
  } else if (url === '/register' || url === '/user-account/signup.html' || url === '/signup.html') { /////
    if (req.method === 'POST') {
      handleRegisterRequest(req, res); 
    } else {
      handleRegisterPage(req, res);
    }

  } else {
    handleStaticFile(req, res);
  }
  
}

module.exports = router;
