const fs = require('fs');
const path = require('path');
const { handleLandingPage, handleLoginPage,handleHomePage, handleStaticFile } = require('./handler');
const { handleLoginRequest } = require('./login');

function router(req, res) {
  const url = req.url;
  if (url === '/' || url === '/landingpage.html' || url === '/landingpage') {
    handleLandingPage(req, res);
  } else if (url === '/login' || url === '/user-account/login.html' || url === 'login.html' ) {
    if (req.method === 'POST') {
      handleLoginRequest(req, res); // Call the handleLoginRequest function for the login POST request
    } else {
      handleLoginPage(req, res);
    }
  }
  else if(url==='/home' || url==='/index.html' || url==='/index')
  {
    handleHomePage(req,res);
  } 
  else {
    handleStaticFile(req, res);
  }
  
}

module.exports = router;
