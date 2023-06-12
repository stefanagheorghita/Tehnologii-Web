const fs = require('fs');
const path = require('path');
const { handleLandingPage, handleLoginPage,handleHomePage, handleStaticFile } = require('./handler');
const { handleLoginRequest } = require('./login');

function router(req, res) {
  const url = req.url;
  if (url === '/' || url === '/index.html') {
    handleLandingPage(req, res);
  } else if (url === '/login') {
    if (req.method === 'POST') {
      handleLoginRequest(req, res); // Call the handleLoginRequest function for the login POST request
    } else {
      handleLoginPage(req, res);
    }
  }
  else if(url==='/home')
  {
    handleHomePage(req,res);
  } 
  else {
    handleStaticFile(req, res);
  }
  
}

module.exports = router;
