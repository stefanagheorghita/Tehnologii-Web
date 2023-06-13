const fs = require('fs');
const path = require('path');
const { handleLandingPage, handleLoginPage, handleHomePage, handleGeneralAnimalPage, handleAllAnimalPage,
        handleZooPlanPage, handleStaticFile, handleAboutUsPage, handleHelpPage } = require('./handler');
const { handleLandingPage, handleLoginPage,handleHomePage,handleGeneralAnimalPage,handleAllAnimalPage, handleZooPlanPage, handleStaticFile, handleAboutUsPage, handleRegisterPage } = require('./handler');
const { handleLoginRequest } = require('./controllers/login');
const { handleRegisterRequest } = require('./controllers/register'); // for register

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
  }  else if (url === '/register' || url === '/user-account/signup.html' || url === '/signup.html') { /////
    if (req.method === 'POST') {
      handleRegisterRequest(req, res); 
    } else {
      handleRegisterPage(req, res);
    }

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
  else if (url === '/aboutUs.html' || url === '/aboutUs' || url === '/aboutus') {
    handleAboutUsPage(req, res);
  }
  else if (url === '/help.html' || url==='/help' || url==='/help-page/help.html') {
    handleHelpPage(req, res);
  }
  else {
    handleStaticFile(req, res);
  }
}

module.exports = router;
