const fs = require('fs');
const path = require('path');
const { replaceImageUrls } = require('./util/imageUtils');
const {includeCss}= require('./util/cssUtils')

function handleLandingPage(req, res) {
  const filePath = '../frontend/landingpage.html';
 
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal server error');
    } else {

    const modifiedContent = includeCss(content, filePath);
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

function handleHomePage(req, res) {
    const filePath = '../frontend/index.html';
   
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Internal server error');
      } else {
  
      const modifiedContent = includeCss(content, filePath);
      replaceImageUrls(modifiedContent, (imgErr, modContent) => {
        if (imgErr) {
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
  

function handleLoginPage(req, res) {
  const filePath = '../frontend/user-account/login.html';
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
    } else {

    const modifiedContent = includeCss(content, filePath);
    res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(modifiedContent, 'utf-8');
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
  handleStaticFile
};
