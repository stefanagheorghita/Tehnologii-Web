const fs = require('fs');
const path = require('path');
const { handleLandingPage, handleLoginPage,handleHomePage,handleGeneralAnimalPage,handleAllAnimalPage, handleZooPlanPage, handleStaticFile, handleAboutUsPage, handleRegisterPage, handleSettingsPage } = require('./handler');
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
  } else if (url === '/settings' && req.method === 'GET') {
    handleSettingsPage(req, res);
    /*if (pathname === '/styles/settings.css') {
      const cssFilePath = path.join(__dirname, '..', 'frontend', 'styles', 'settings.css');
      serveStaticFile(cssFilePath, 'text/css', res);
    } else if (pathname === '/settings-script.js') {
      const jsFilePath = path.join(__dirname, '..', 'frontend', 'settings-script.js');
      serveStaticFile(jsFilePath, 'text/javascript', res);
    }*/
    
  }
  else {
    handleStaticFile(req, res);
  }
}

function serveStaticFile(filePath, contentType, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('Internal Server Error');
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(data);
    }
  });
}


module.exports = router;
