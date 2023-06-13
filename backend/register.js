const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 10;


mongoose.connect('mongodb://127.0.0.1:27017/web_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});


const User = mongoose.model('User', userSchema);

async function handleRegisterRequest(req, res) {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const formData = querystring.parse(body);

      
      const name = formData.name;
      const email = formData.email;
      const password = formData.password;
      const confirmPassword = formData.confirmPassword;

      
      if (password !== confirmPassword) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Passwords do not match</h1>');
        return;
      }

      try {
        
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'text/html');
          res.end('<h1>Email already exists</h1>');
          return;
        }

        
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        
        await saveUserToDatabase(name, email, hashedPassword);

        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Registration successful</h1>');
      } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Internal Server Error</h1>');
        console.error('Error saving user:', error);
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
}


function saveUserToDatabase(name, email, hashedPassword) {
  
  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
  });

  
  return user.save();
}

module.exports = { handleRegisterRequest };



/*
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 10;


mongoose.connect('mongodb://127.0.0.1:27017/web_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});


const User = mongoose.model('User', userSchema);

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);

  if (pathname === '/register' && req.method === 'GET') {
    
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
    
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const formData = querystring.parse(body);

      
      const name = formData.name;
      console.log(name);
      const email = formData.email;
      console.log(email);
      const password = formData.password;
      console.log(password);
      const confirmPassword = formData.confirmPassword;
      console.log(confirmPassword);

      
      if (password !== confirmPassword) {
        alert('Passwords incorrect!');
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Passwords do not match</h1>');
        return;
      }

      
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/html');
          res.end('<h1>Internal Server Error</h1>');
          return;
        }

        
        saveUserToDatabase(name, email, hashedPassword)
          .then(() => {
            // Send a response indicating successful registration
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end('<h1>Registration successful</h1>');
          })
          .catch((error) => {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/html');
            res.end('<h1>Internal Server Error</h1>');
            console.error('Error saving user:', error);
          });
      });
    });
  } else if (pathname === '/styles/style-signup.css') {
    
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
  
  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
  });

  
  return user.save();
}

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

*/