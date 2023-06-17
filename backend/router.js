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
    handleSettingsPage,
    handleAdminPage,
    handleSettingsPageInfo,
    handleEmailUpdate, 
    handleNameUpdate,
    handlePasswordUpdate,
    handleAddLike,
    handleRemoveLike
    
} = require('./handler');
const { handleLoginRequest } = require('./controllers/login');
const { handleRegisterRequest } = require('./controllers/register'); // for register
const { handleForgotPasswordRequest } = require('./controllers/forgot');
const { handleProgramRequest } = require('./controllers/program');
const { handleSettingsRequest } = require('./controllers/settings');
const { handleCriteriaRequest } = require('./animals/criteria');
const { deleteUserFromDatabase } = require('./util/infoDatabaseUtil');
const { deleteAnimalFromDatabase } = require('./util/infoDatabaseUtil');
const { deleteReservationFromDatabase } = require('./util/infoDatabaseUtil');
const { extractUserIdFromUrl } = require('./handler');
const { extractAnimalIdFromUrl } = require('./handler');
const { extractReservationIdFromUrl } = require('./handler');
const { insertAnimals } = require('./util/infoDatabaseUtil');
const {exportJson, exportXml, moreAnimalsExport} = require('./operations/export');
const {verifyIfUserLiked,getLikesCount}=require('./util/likes')

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
        if (url.startsWith('/all-animals/search-animal')) {
            const queryString = url.includes('?') ? url.substring(url.indexOf('?') + 1) : '';
            const queryParams = new URLSearchParams(queryString);
            const criteria = {};
            console.log(queryParams);
            const searchTerm = queryParams.get('term');
            handleAllAnimalPage(req, res, null, searchTerm);
        } else {
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
                    criteria[key] = value;
                }
            }

            console.log(criteria);
            handleAllAnimalPage(req, res, Object.keys(criteria).length > 0 ? criteria : null, null);
        }
    } else if (url === '/zooplan' || url === '/zoo-plan.html' || url === '/zoo-plan' || url === '/zoo-plan/zoo-plan.html') {
        handleZooPlanPage(req, res);
    } else if (url === '/aboutUs.html' || url === '/aboutUs' || url === '/aboutus') {
        handleAboutUsPage(req, res);
    } else if (url === '/settings.html' || url === '/settings' || url === '/settings.html') {
        if (req.method === 'POST') {

            handleSettingsRequest(req, res);

        } /*else if (req.method === 'GET'){
          handleSettingsGetRequest(req, res)
        }*/ else if (req.method) {
            handleSettingsPage(req, res);
            //handleSettingsRequest(req, res);
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
        const animalId = new URLSearchParams(url.slice(url.indexOf('?'))).get('id');
        handleOneAnimalPage(req, res, animalId);
    } else if (url.startsWith('/criteria')) {
        handleCriteriaRequest(req, res);
    } else if (url.startsWith('/animal/')) {
        const animalId = new URLSearchParams(url.slice(url.indexOf('?'))).get('id');

        if (url.startsWith('/animal/json')) {
            exportJson(animalId, req, res);

        } else if (url.startsWith('/animal/xml')) {
            exportXml(animalId, req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }

    } else if (url.startsWith('/json') || url.startsWith('/xml') || url.startsWith('/csv')) {
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
                criteria[key] = value;
            }
        }
        moreAnimalsExport(criteria, req, res);
    }
    else if (url.startsWith('/delete-user')) {
        if (req.method === 'DELETE') {
            const userId = extractUserIdFromUrl(url);
            if (userId) {
                try {
                    deleteUserFromDatabase(userId);
                    res.statusCode = 200;
                    res.end('User deleted successfully');
                } catch (error) {
                    console.error('Error deleting user:', error);
                    res.statusCode = 500;
                    res.end('Error deleting user. Please try again.');
                }
            } else {
                res.statusCode = 400;
                res.end('Invalid request. User ID not provided.');
            }
        } else {
            res.statusCode = 405;
            res.end('Method Not Allowed');
        }
    }
    else if (url.startsWith('/delete-animal')) {
        if (req.method === 'DELETE') {
            const animalId = extractAnimalIdFromUrl(url);
            if (animalId) {
                try {
                    deleteAnimalFromDatabase(animalId);
                    res.statusCode = 200;
                    res.end('Animal deleted successfully');
                } catch (error) {
                    console.error('Error deleting animal:', error);
                    res.statusCode = 500;
                    res.end('Error deleting animal. Please try again.');
                }
            } else {
                res.statusCode = 400;
                res.end('Invalid request. Animal ID not provided.');
            }
        } else {
            res.statusCode = 405;
            res.end('Method Not Allowed');
        }
    }
    else if(url.startsWith('/delete-reservation')){
        if (req.method === 'DELETE') {
            const reservationId = extractReservationIdFromUrl(url);
            if (reservationId) {
                try {
                    deleteReservationFromDatabase(reservationId);
                    res.statusCode = 200;
                    res.end('Reservation deleted successfully');
                } catch (error) {
                    console.error('Error deleting reservation:', error);
                    res.statusCode = 500;
                    res.end('Error deleting reservation. Please try again.');
                }
            } else {
                res.statusCode = 400;
                res.end('Invalid request. Reservation ID not provided.');
            }
        } else if (url === '/import-animals') 
            if(req.method === 'POST')
          {
            let fileData = '';
        
            req.on('data', chunk => {
              fileData += chunk;
            });
        
            req.on('end', () => {
              // Process the file data or perform any desired operations
              console.log('Received file:', fileData);
        
              res.statusCode = 200;
              res.end('File received successfully.');
            });
          } 
         else {
            res.statusCode = 405;
            res.end('Method Not Allowed');
        }
    }

    else if (url === '/admin') {
        handleAdminPage(req, res);
    }
    else if (url === '/profile' && req.method==='GET'){
      handleSettingsPageInfo(req,res);
    }
    else if(url === '/update-name' && req.method==='PUT'){
      handleNameUpdate(req, res);
    }
    else if(url === '/update-email' && req.method==='PUT'){
      handleEmailUpdate(req, res);
     
    }
    else
    if (url === '/update-password' && req.method==='PUT'){
        handlePasswordUpdate(req, res);
    }
    else if (url.startsWith('/add-like')){
        handleAddLike(req, res);
    }
    else if (url.startsWith('/remove-like')){
       handleRemoveLike(req, res);
    }
    else if(url.startsWith('/get-like-state'))
    {
        verifyIfUserLiked(req, res);
    }
    else if(url.startsWith('/get-likes-count'))
    {
        getLikesCount(req,res);
    }
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