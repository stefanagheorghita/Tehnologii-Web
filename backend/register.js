const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);

  if (pathname === '/') {
    // Serve the HTML file
    const htmlFilePath = path.join(__dirname, '..', 'user-account', 'signup.html');
    fs.readFile(htmlFilePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    });
  } else if (pathname === '/register' && req.method === 'POST') {
    // Handle the registration form submission
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const formData = querystring.parse(body);

      // Extract form data
      const name = formData.name;
      const email = formData.email;
      const password = formData.password;
      const confirmPassword = formData.confirmPassword;

      // Check if passwords match
      if (password !== confirmPassword) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Passwords do not match');
        return;
      }

      // Hash the password
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Internal Server Error');
          return;
        }

        // Save the user data and hashed password to the database
        saveUserToDatabase(name, email, hashedPassword);

        // Send a response indicating successful registration
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Registration successful');
      });
    });
  } else if (pathname === '/styles/style-signup.css') {
    // Serve the CSS file
    const cssFilePath = path.join(__dirname, '..', 'user-account', 'styles', 'style-signup.css');
    fs.readFile(cssFilePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css');
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

function saveUserToDatabase(name, email, password) {
  // Implement your code here to save the user data to the database
  // This is just a placeholder function
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Hashed Password:', password);
}

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
