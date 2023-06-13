const fs = require('fs');
const path = require('path');
const { handleLandingPage, handleLoginPage,handleHomePage,handleGeneralAnimalPage,handleAllAnimalPage, handleZooPlanPage, handleStaticFile } = require('./handler');
const { handleLoginRequest } = require('./login');

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
  } 
  else if (url === '/animals.html'  || url === '/animals') {
    handleGeneralAnimalPage(req, res);
  }
  else if (url === '/all_animals.html'  || url === '/all_animals') {
      handleAllAnimalPage(req, res);
  }
  else if (url === '/zooplan' || url === '/zoo-plan.html' || url === '/zoo-plan' || url === '/zoo-plan/zoo-plan.html') {
    handleZooPlanPage(req, res); 
  }
  else {
    handleStaticFile(req, res);
  }
  
}

module.exports = router;
