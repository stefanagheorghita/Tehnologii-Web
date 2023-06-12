const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url);

  if (reqUrl.pathname === '/login' && req.method === 'GET') {
    // Handle login functionality
    // Call a function from your login module
    // Example: loginModule.handleLogin(req, res);
  } else if (reqUrl.pathname === '/other' && req.method === 'GET') {
    // Handle other functionality
    // Call a function from another module
    // Example: otherModule.handleOther(req, res);
  } else if (reqUrl.pathname === '/') {
    // Serve the HTML file
    const imageFiles = ['images/gradient.jpg','images/zooo.png', 'images/photograph.png', 'images/zoo-visitors.png', 'images/acvariu.png'];
    serveHtmlWithCssAndImages(res, 'landingpage.html', ['landing.css', 'styles/style.css'],imageFiles);
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

function serveHtmlWithCssAndImages(res, filename, cssFiles, imageFiles) {
  const htmlFilePath = path.join(__dirname, '..', 'frontend', filename);
  const cssFilePaths = cssFiles.map((cssFile) => path.join(__dirname, '..', 'frontend', cssFile));

  fs.readFile(htmlFilePath, 'utf8', (err, htmlContent) => {
    if (err) {
      res.statusCode = 500;
      res.end('Internal server error');
    } else {
      readCssFiles(cssFilePaths, (err, cssContents) => {
        if (err) {
          res.statusCode = 500;
          res.end('Internal server error');
        } else {
          readImageFiles(imageFiles, (err, imageContents) => {
            if (err) {
              res.statusCode = 500;
              res.end('Internal server error');
            } else {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/html');
              res.end(insertCssAndImageContent(htmlContent, cssContents, imageContents, imageFiles));
            }
          });
        }
      });
    }
  });
}

function insertCssAndImageContent(htmlContent, cssContents, imageContents, imageFiles) {
  const cssTags = cssContents.map((cssContent) => `<style>${cssContent}</style>`).join('');
  const backgroundImageCss = `background-image: url("${imageFiles[0]}");`;

  let modifiedHtmlContent = htmlContent
    .replace('</head>', `${cssTags}</head>`)
    .replace('<body>', `<body style="${backgroundImageCss}">`);

  imageFiles.forEach((imageFile, index) => {
    const base64Content = Buffer.from(imageContents[index]).toString('base64');
    const mimeType = path.extname(imageFile).replace('.', '');
    modifiedHtmlContent = modifiedHtmlContent.replace(`<img src="${imageFile}" alt="image">`, `<img src="data:image/${mimeType};base64,${base64Content}" alt="image">`);
  });

  return modifiedHtmlContent;
}

function readImageFiles(imageFiles, callback) {
  let imageCount = 0;
  let imageContents = [];

  imageFiles.forEach((imageFile) => {
    fs.readFile(path.join(__dirname, '..','frontend', imageFile), (err, imageContent) => {
      imageCount++;
      if (err) {
        callback(err);
        return;
      }
      imageContents.push(imageContent);
      if (imageCount === imageFiles.length) {
        callback(null, imageContents);
      }
    });
  });
}
function readCssFiles(cssFilePaths, callback) {
  let cssCount = 0;
  let cssContents = [];

  cssFilePaths.forEach((cssFilePath) => {
    fs.readFile(cssFilePath, 'utf8', (err, cssContent) => {
      cssCount++;
      if (err) {
        callback(err);
        return;
      }
      cssContents.push(cssContent);
      if (cssCount === cssFilePaths.length) {
        callback(null, cssContents);
      }
    });
  });
}




const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
