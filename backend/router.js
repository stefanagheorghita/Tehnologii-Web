const fs = require('fs');
const {
    handleLandingPage,
    handleLoginPage,
    handleHomePage,
    handleGeneralAnimalPage,
    handleAllAnimalPage,
    handleZooPlanPage,
    handleStaticFile,
    handleAboutUsPage,
    handleRegisterPage,
    handleHelpPage, /*handleForgotPasswordPage,*/
    handleProgramPage,
    handleOneAnimalPage,
    handleSettingsPage
} = require('./handler');
const {handleLoginRequest} = require('./controllers/login');
const {handleRegisterRequest} = require('./controllers/register'); // for register
const {handleForgotPasswordRequest} = require('./controllers/forgot');
const {handleProgramRequest} = require('./controllers/program');
const {handleSettingsRequest} = require('./controllers/settings');
const { handleCriteriaRequest } = require('./animals/criteria');
const { searchAnimals } = require('./animals/searchAnimals');
function router(req, res) {
    const url = req.url;
    if (url === '/' || url === '/landingpage.html' || url === '/landingpage') {
        handleLandingPage(req, res);
    } else if (url === '/login' || url === '/user-account/login.html' || url === '/login.html') {
        if (req.method === 'POST') {
            handleLoginRequest(req, res);
        } else {
            handleLoginPage(req, res);
        }
    } else if (url === '/home' || url === '/index.html' || url === '/index' || url === '../index.html') {
        handleHomePage(req, res);
    } else if (url === '/register' || url === '/user-account/signup.html' || url === '/signup.html') { /////
        if (req.method === 'POST') {
            handleRegisterRequest(req, res);
        } else {
            handleRegisterPage(req, res);
        }
    } else if (url === '/animals.html' || url === '/animals') {
        handleGeneralAnimalPage(req, res);
    } else if (url.startsWith('/all-animals') || url.startsWith('/all_animals')) {
        if(url.startsWith('/all-animals/search-animal'))
        {
            const queryString = url.includes('?') ? url.substring(url.indexOf('?') + 1) : '';
            const queryParams = new URLSearchParams(queryString);
            const criteria = {};
            console.log(queryParams);
            const searchTerm = queryParams.get('term'); 
            handleAllAnimalPage(req,res,null,searchTerm);
        }
        else{
        const queryString = url.includes('?') ? url.substring(url.indexOf('?') + 1) : '';
        const queryParams = new URLSearchParams(queryString);
        const criteria = {};
        
        for (const [key, value] of queryParams) {
            if (value.includes('%')) {
              criteria[key] = value.split('%'); 
            } else {
              criteria[key] = value;
            }
          }
          for (const [key, value] of queryParams) {
            if (value.includes(',')) {
              criteria[key] = value.split(','); 
            } else {
              criteria[key] =value; 
            }
          }
        
          console.log(criteria);
        handleAllAnimalPage(req, res, Object.keys(criteria).length > 0 ? criteria : null,null);}
      } 
       else if (url === '/zooplan' || url === '/zoo-plan.html' || url === '/zoo-plan' || url === '/zoo-plan/zoo-plan.html') {
        handleZooPlanPage(req, res);
    } else if (url === '/aboutUs.html' || url === '/aboutUs' || url === '/aboutus') {
        handleAboutUsPage(req, res);
    } else if (url === '/settings.html' || url === '/settings' || url === '/settings.html') {
        if (req.method === 'POST') {
           
                handleSettingsRequest(req, res);
              
        } else {
            handleSettingsPage(req, res);
        }

    } else if (url === '/help.html' || url === '/help' || url === '/help-page/help.html') {
        handleHelpPage(req, res);
    }
    /*else if (url === '/user-account/forgot.html' || url === '/forgot.html' || url === '/forgot') {
      if (req.method === 'POST') {
        handleForgotPasswordRequest(req, res);
      } else {
        handleForgotPasswordPage(req, res);
      }
    }*/
    else if (url === '/program.html' || url === '/program') {
        if (req.method === 'POST') {
            handleProgramRequest(req, res);
        } else {
            handleProgramPage(req, res);
        }
    } else if (url.startsWith('/Animal')) {
        // Extract the animal ID from the query parameters
        const animalId = new URLSearchParams(url.slice(url.indexOf('?'))).get('id');
        handleOneAnimalPage(req, res, animalId);
    }
    else if (url.startsWith('/criteria')) {
        handleCriteriaRequest(req, res);
    }
//     else if(url.startsWith('/search-animal')) {
//         const queryString = url.includes('?') ? url.substring(url.indexOf('?') + 1) : '';
//   const queryParams = new URLSearchParams(queryString);
//   const criteria = {};
//   console.log(queryParams);
//   const searchTerm = queryParams.get('term'); 
//   searchAnimals(searchTerm)
//     .then(results => {
//       const response = {
//         status: 'success',
//         data: results
//       };
//       res.writeHead(200, { 'Content-Type': 'application/json' });
//       res.end(JSON.stringify(response));
//     })
//     .catch(error => {
//       console.error('Error searching animals:', error);
//       const response = {
//         status: 'error',
//         message: 'An error occurred while searching animals'
//       };
//       res.writeHead(500, { 'Content-Type': 'application/json' });
//       res.end(JSON.stringify(response));
//     });
  //  }
    else {
        handleStaticFile(req, res);
    }
}

// function bodyParser(req, res, next) {
//     let body = '';
//     req.on('data', (chunk) => {
//       body += chunk;
//     });
  
//     req.on('end', () => {
//       req.body = JSON.parse(body);
//       next();
//     });
//   }

/*function serveStaticFile(filePath, contentType, res) {
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
}*/


module.exports = router;
