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
    handleRemoveLike,
    handleForgotPasswordPage,
    handleForgotPasswordRequest,
    
    handleContactUs,
    handleSendTypes,
    handleFindFavorites,
    handleAquariumPage,
    handleLanguageRequest

} = require('./handler');
const {handleLoginRequest} = require('./controllers/login');
const {handleRegisterRequest} = require('./controllers/register'); // for register
const {handleProgramRequest} = require('./controllers/program');
const {handleSettingsRequest} = require('./controllers/settings');
const {handleCriteriaRequest} = require('./animals/criteria');
const {exportJson, exportXml, moreAnimalsExport} = require('./operations/export');
const {verifyIfUserLiked,getLikesCount}=require('./util/likes')
const {insertAnimal, insertAnimalWithXML} = require('./util/infoDatabaseUtil');
const {extractAnimalIdFromUrl, extractUserIdFromUrl, extractReservationIdFromUrl} = require('./handler');
const {deleteUserFromDatabase, deleteAnimalFromDatabase, deleteReservationFromDatabase} = require('./util/infoDatabaseUtil');

const {handleContactUsRequest} = require('./controllers/contactUs');
const {authenticateUser} = require('./util/token');
const {changeLanguage}=require('./util/language');
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

            handleAllAnimalPage(req, res, Object.keys(criteria).length > 0 ? criteria : null, null);
        }
    } else if (url === '/zooplan' || url === '/zoo-plan.html' || url === '/zoo-plan' || url === '/zoo-plan/zoo-plan.html') {
        handleZooPlanPage(req, res);
    } else if (url === '/aboutUs.html' || url === '/aboutUs' || url === '/aboutus') {
        handleAboutUsPage(req, res);
    } else if (url === '/settings.html' || url === '/settings') {
        if (authenticateUser(req, res,0) === 0) {
            console.log("not authenticated");
            res.statusCode = 402;
            res.setHeader('Location', '/landingpage');
            res.end();

        } else {
            if (req.method === 'POST') {

                handleSettingsRequest(req, res);

            } 
               
            /*else if (req.method === 'GET'){
          handleSettingsGetRequest(req, res)
        }*/ else if (req.method) {
                handleSettingsPage(req, res);
                //handleSettingsRequest(req, res);
            }
            // }
        }
    } else if (url === '/help.html' || url === '/help' || url === '/help-page/help.html') {
        handleHelpPage(req, res);
    }
    else if (url === '/program.html' || url === '/program') {
        if (req.method === 'POST') {
            handleProgramRequest(req, res);
        } else {
            handleProgramPage(req, res);
        }
    } else if (url === '/contact' || url === '/contact-us.html') {
        if (req.method === 'GET') {
            handleContactUs(req, res);
        } else if (req.method === 'POST') {
            handleContactUsRequest(req, res);
        }
    } else if (url === '/aquarium' || url === '/aquarium/aquarium.html' || url === '/aquarium.html') {
        
        handleAquariumPage(req, res);

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
            res.writeHead(404, {'Content-Type': 'text/plain'});
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

    } else if (url === '/admin') {
        console.log("admin");
        if (authenticateUser(req, res,1) === 0) {
            console.log("not authenticated");
            res.statusCode = 402;
            res.setHeader('Location', '/landingpage');
            res.end();

        } else {
        handleAdminPage(req, res);}
    } else if (url === '/profile' && req.method === 'GET') {
        handleSettingsPageInfo(req, res);
    } else if (url === '/update-name' && req.method === 'PUT') {
        handleNameUpdate(req, res);
    } else if (url === '/update-email' && req.method === 'PUT') {
        handleEmailUpdate(req, res);

    } else if (url === '/update-password' && req.method === 'PUT') {
        handlePasswordUpdate(req, res);
    } else if (url.startsWith('/add-like')) {
        handleAddLike(req, res);
    } else if (url.startsWith('/remove-like')) {
        handleRemoveLike(req, res);
    } else if (url.startsWith('/get-like-state')) {
        verifyIfUserLiked(req, res);
    }
    else if(url.startsWith('/get-likes-count'))
    {
        getLikesCount(req,res);
    }else if (url.startsWith('/delete-user')) {
        if(authenticateUser(req, res,1) === 0)
        {
            console.log("not authenticated");
            res.statusCode = 402;
            res.setHeader('Location', '/landingpage');
            res.end();
        }
        else{
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
    }}
    else if (url.startsWith('/delete-animal')) {
        if(authenticateUser(req, res,1) === 0)
        {   console.log("not authenticated");

            res.statusCode = 402;
            res.setHeader('Location', '/landingpage');
            res.end();
    } else {
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
    }}
    else if(url.startsWith('/delete-reservation')){
        if(authenticateUser(req, res,1) === 0)
        {
            console.log("not authenticated");
            res.statusCode = 402;
            res.setHeader('Location', '/landingpage');
            res.end();
        }
        else{
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
        } }
 } 
    else if(url === '/import-animals' && req.method==='POST'){
        let formData = '';
        req.on('data', (chunk) => {
            formData += chunk;
        });

        req.on('end', () => {
            insertAnimal(formData);
            res.statusCode = 200;
            res.end('Animals inserted successfully');
        });
    }
    else if (url === '/user-account/forgot.html' || url === '/forgot.html' || url === '/forgot') {
        if (req.method === 'POST') {
          handleForgotPasswordRequest(req, res);
        } else {
          handleForgotPasswordPage(req, res);
        }
      }
      else if (url.startsWith('/get-types')) {
        handleSendTypes(req, res);
    }
    else if(url.startsWith('/get-favorites'))
    {
        handleFindFavorites(req, res);
    } 
    else if(url === '/import-animals-xml' && req.method==='POST'){
        let formData = '';
        req.on('data', (chunk) => {
            formData += chunk;
        });

        req.on('end', () => {
            insertAnimalWithXML(formData);
            res.statusCode = 200;
            res.end('Animals inserted successfully');
        });
    }
     else if (req.method === 'POST' && req.url === '/language') {
        handleLanguageRequest(req,res);
       }
       else if(url==='/check-authentication')
       {
        if(authenticateUser(req,res,1)===0)
        {
            res.statusCode = 402;
            res.end();
        }
        else{
            res.statusCode = 200;
            res.end();
        }
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