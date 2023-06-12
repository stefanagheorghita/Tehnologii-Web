const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 10;

// Connect to your MongoDB database
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for the user collection
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Create a mongoose model for the user collection
const User = mongoose.model('User', userSchema);

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);

  if (pathname === '/register' && req.method === 'GET') {
    // Serve the HTML file
    const htmlFilePath = path.join(__dirname, '..', 'frontend', 'user-account', 'signup.html');
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
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Passwords do not match</h1>');
        return;
      }

      // Hash the password
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/html');
          res.end('<h1>Internal Server Error</h1>');
          return;
        }

        // Save the user data and hashed password to the database
        saveUserToDatabase(name, email, hashedPassword);

        // Send a response indicating successful registration
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Registration successful</h1>');
      });
    });
  } else if (pathname === '/styles/style-signup.css') {
    // Serve the CSS file
    const cssFilePath = path.join(__dirname, '..', 'frontend', 'user-account', 'styles', 'style-signup.css');
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

function saveUserToDatabase(name, email, hashedPassword) {
  // Create a new user instance
  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
  });

  // Save the user to the database
  user.save((err) => {
    if (err) {
      console.error('Error saving user:', err);
    } else {
      console.log('User saved successfully');
    }
  });
}

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
