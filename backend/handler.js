const fs = require('fs');
const path = require('path');
const { replaceImageUrls } = require('./util/imageUtils');
const {includeAssets}= require('./util/cssUtils')
const { getBackgroundImageFromDatabase } = require('./util/fileFromDatabaseUtil');

// for the landing page
function handleLandingPage(req, res) {
  const filePath = '../frontend/landingpage.html';
 
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal server error');
    } else {

    const modifiedContent = includeAssets(content, filePath);
    replaceImageUrls(modifiedContent, (imgErr, modContent) => {
      if (imgErr) {
        console.log('eede');
        res.writeHead(500);
        res.end('Internal server error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(modContent, 'utf-8');
      }
    });
   
    }
  });
}
// for the home page
function handleHomePage(req, res) {
  const filePath = '../frontend/index.html';

  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal server error');
    } else {
      const modifiedContent = includeAssets(content, filePath);
      replaceImageUrls(modifiedContent, async (imgErr, modContent) => {
        if (imgErr) {
          res.writeHead(500);
          res.end('Internal server error');
        } else {
          try {
            const imageId = '64884885df77d90a8234a7f6'; 
            const backgroundImage = await getBackgroundImageFromDatabase(imageId);
            const updatedContent = modContent.replace("background-image: url('images/tigru2.jpg')", `background-image: url('${backgroundImage}')`);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(updatedContent, 'utf-8');
          } catch (error) {
            res.writeHead(500);
            res.end('Internal server error');
          }
        }
      });
    }
  });
}
// for the login page
function handleLoginPage(req, res) {
  const filePath = '../frontend/user-account/login.html';
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
    } else {

    const modifiedContent = includeAssets(content, filePath);
    res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(modifiedContent, 'utf-8');
    }
  });
}
// for the categories page
function handleGeneralAnimalPage(req, res) {
  const filePath = '../frontend/animals.html';

  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal server error');
    } else {
      const modifiedContent = includeAssets(content, filePath);
      replaceImageUrls(modifiedContent, async (imgErr, modContent) => {
        if (imgErr) {
          res.writeHead(500);
          res.end('Internal server error');
        } else {
          try {
            const imageId = '64886109df77d90a8234a7f7'; 
            const backgroundImage = await getBackgroundImageFromDatabase(imageId);
            const updatedContent = modContent.replace("background-image: url(../images/gorilla.jpg)", `background-image: url('${backgroundImage}')`);
            const imageId2 = '64886238df77d90a8234a7f8';
            const backgroundImage2 = await getBackgroundImageFromDatabase(imageId2);
            const updatedContent2 = updatedContent.replace("background-image: url(../images/foot1.png)", `background-image: url('${backgroundImage2}')`);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(updatedContent2, 'utf-8');
          } catch (error) {
            res.writeHead(500);
            res.end('Internal server error');
          }
        }
      });
    }
  });
}

function handleAllAnimalPage(req, res) {
  const filePath = '../frontend/all_animals.html';
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal server error');
    } else {
      const modifiedContent = includeAssets(content, filePath);
      replaceImageUrls(modifiedContent, async (imgErr, modContent) => {
        if (imgErr) {
          res.writeHead(500);
          res.end('Internal server error');
        } else {
          try {
            const imageId = '64886109df77d90a8234a7f7'; 
            const backgroundImage = await getBackgroundImageFromDatabase(imageId);
            const updatedContent = modContent.replace("background-image: url(../images/gorilla.jpg)", `background-image: url('${backgroundImage}')`);
            const imageId2 = '64886238df77d90a8234a7f8';
            const backgroundImage2 = await getBackgroundImageFromDatabase(imageId2);
            const updatedContent2 = updatedContent.replace("background-image: url(../images/foot1.png)", `background-image: url('${backgroundImage2}')`);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(updatedContent2, 'utf-8');
          } catch (error) {
            res.writeHead(500);
            res.end('Internal server error');
          }
        }
      });
    }
  });
}

//for the zoo plan page
function handleZooPlanPage(req, res) {
  const filePath = '../frontend/zoo-plan/zoo-plan.html';
 
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal server error');
    } else {

    const modifiedContent = includeAssets(content, filePath);
    replaceImageUrls(modifiedContent, (imgErr, modContent) => {
      if (imgErr) {
        console.log('eede');
        res.writeHead(500);
        res.end('Internal server error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(modContent, 'utf-8');
      }
    });   
    }
  });
  }

  function handleAboutUsPage(req, res) {
    const filePath = '../frontend/aboutUs.html';
 
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal server error');
    } else {

    const modifiedContent = includeAssets(content, filePath);
    replaceImageUrls(modifiedContent, (imgErr, modContent) => {
      if (imgErr) {
        console.log('eede');
        res.writeHead(500);
        res.end('Internal server error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(modContent, 'utf-8');
      }
    });   
    }
  });
  }



function handleStaticFile(req, res) {
  const filePath = path.join(__dirname, 'frontend', req.url);
  const extension = path.extname(filePath).substring(1);
  const contentType = getContentType(extension);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Internal server error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

//for register page
function handleRegisterPage(req, res) {
  const filePath = '../frontend/user-account/signup.html';
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
    } else {

    const modifiedContent = includeAssets(content, filePath);
    res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(modifiedContent, 'utf-8');
    }
  });
}
///////////

function getContentType(extension) {
  switch (extension) {
    case 'html':
      return 'text/html';
    case 'css':
      return 'text/css';
    case 'js':
      return 'text/javascript';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    default:
      return 'application/octet-stream';
  }
}

function readCssFiles(cssFiles, callback) {
  let cssCount = 0;
  let cssContents = [];

  cssFiles.forEach((cssFilePath) => {
    fs.readFile(cssFilePath, 'utf8', (err, cssContent) => {
      cssCount++;
      if (err) {
        callback(err);
        return;
      }
      cssContents.push(cssContent);
      if (cssCount === cssFiles.length) {
        callback(null, cssContents);
      }
    });
  });
}



module.exports = {
  handleLandingPage,
  handleLoginPage,
  handleHomePage,
  handleGeneralAnimalPage,
  handleAllAnimalPage,
  handleZooPlanPage,
  handleAboutUsPage,
  handleRegisterPage, 
  handleStaticFile
};
