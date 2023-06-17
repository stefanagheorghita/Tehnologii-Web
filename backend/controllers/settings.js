const { ObjectId } = require('mongodb');
const {getClient} = require('../util/db');
const jwt = require('jsonwebtoken');
const { get } = require('mongoose');
const dbName = 'web_db';
const {getUserFromDatabase} = require('../util/infoDatabaseUtil');
async function handleSettingsRequest(req, res) {
    console.log('in handleSettingsRequest');
   // const client = getClient();

    try {
        await client.connect();
        console.log('in handleSettingsRequest try');
      
       // const cookieHeader = req.headers.cookie;
        //const token = parseCookie(cookieHeader, 'token');
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[2];
        console.log('token = ' + token);
        const secretKey = 'your_secret_key_here';

        const decodedToken = jwt.verify(token, secretKey);
        if (!decodedToken) {
            console.log('Invalid token');
            res.writeHead(401, {'Content-Type': 'text/html'});
            res.write('<h1>Invalid token</h1>');
            res.end();
            return;
        }

        const userEmail = decodedToken.email;
        const id = decodedToken.id;
        const collection = client.db(dbName).collection('users');

        const user = await getUserFromDatabase(id);


        if (!user) {
            console.log('User not found');
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write('<h1>User not found</h1>');
            res.end();
            return;
        }

        console.log('in handleSettingsRequest bef get');

        if (req.method === 'GET') {
            const mode = user.mode || false;
            console.log('mode = ' + mode);


            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({mode}));
            res.end();
        } else if (req.method === 'POST') {
            let body = '';

            req.on('data', (chunk) => {
                body += chunk;
            });

            req.on('end', async () => {
                try {
                    const {darkModeToggle} = JSON.parse(body);
                    user.mode = darkModeToggle;
                    console.log('darkModeToggle = ' + darkModeToggle);
                    console.log('user.mode = ' + user.mode);
                    console.log('id = ' + id);
                   console.log('user = ' + user._id);
                    const result = await collection.updateOne({email: userEmail}, {$set: {mode: darkModeToggle}});
                    if(result.modifiedCount !== 1) {
                        console.log('Error updating user');
                    }
                    else{console.log('User updated');}
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.write(JSON.stringify({mode: darkModeToggle}));
                    res.end();
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    res.writeHead(400, {'Content-Type': 'text/plain'});
                    res.end('Bad Request');
                }
            });
        }
    } catch (error) {
        console.error('Error handling settings request:', error);
        res.writeHead(500, {'Content-Type': 'text/html'});
        res.write('<h1>Internal Server Error</h1>');
        res.end();
    } finally {
        // await client.close();
        // console.log('Disconnected from the database');
    }
}

function parseCookie(cookieHeader, cookieName) {
    if (cookieHeader) {
        const cookies = cookieHeader.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === cookieName) {
                return value;
            }
        }
    }
    return undefined;
}

// function renderPage(req, res, pageContent, mode) {
//   const html = `
//     <html>
//       <head>
//         <link rel="stylesheet" href="/path/to/dark-theme.css">
//         <!-- Other stylesheets and meta tags -->
//       </head>
//       <body>
//         ${pageContent}
//       </body>
//     </html>
//   `;

//   res.writeHead(200, { 'Content-Type': 'text/html' });
//   res.write(html);
//   res.end();
// }

// //  GET request /settings
// function handleSettingsGetRequest(req, res) {
//   // Retrieve the mode setting from the user object
//   const mode = user.mode || false;

//   // Send the mode setting as a JSON response
//   res.writeHead(200, { 'Content-Type': 'application/json' });
//   res.write(JSON.stringify({ mode }));
//   res.end();
// }

module.exports = {handleSettingsRequest};


/*const { getClient } = require('../util/db');
const jwt = require('jsonwebtoken');
const dbName = 'web_db';

async function handleSettingsRequest(req, res) {
  const client = getClient();

  try {
    await client.connect();
    console.log('Connected to the database');

    const cookieHeader = req.headers.cookie;
    const token = parseCookie(cookieHeader, 'token');
    const secretKey = 'your_secret_key_here';

    const decodedToken = jwt.verify(token, secretKey);
    if (!decodedToken) {
      console.log('Invalid token');
      res.writeHead(401, { 'Content-Type': 'text/html' });
      res.write('<h1>Invalid token</h1>');
      res.end();
      return;
    }

    const userEmail = decodedToken.email;

    const collection = client.db(dbName).collection('users');

    const user = await collection.findOne({ email: userEmail });

    if (!user) {
      console.log('User not found');
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.write('<h1>User not found</h1>');
      res.end();
      return;
    }

    if (req.method === 'GET') {
      // Retrieve the mode setting from the user object
      const mode = user.mode || false;

      // Send the mode setting as a JSON response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ mode }));
      res.end();
    } else if (req.method === 'POST') {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', async () => {
        try {
          const { darkModeToggle } = JSON.parse(body);
          console.log('Dark mode toggle value:', darkModeToggle);

          // Update the user object with the new mode setting
          user.mode = darkModeToggle;
          await collection.updateOne({ email: userEmail }, { $set: { mode: darkModeToggle } });

          // Send the updated mode setting as a JSON response
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify({ mode: darkModeToggle }));
          res.end();
        } catch (error) {
          console.error('Error parsing JSON:', error);
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Bad Request');
        }
      });
    }
  } catch (error) {
    console.error('Error handling settings request:', error);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.write('<h1>Internal Server Error</h1>');
    res.end();
  } finally {
    // await client.close();
    // console.log('Disconnected from the database');
  }
}

function parseCookie(cookieHeader, cookieName) {
  if (cookieHeader) {
    const cookies = cookieHeader.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === cookieName) {
        return value;
      }
    }
  }
  return undefined;
}

module.exports = { handleSettingsRequest };*/


/*const { getClient } = require('../util/db');
const jwt = require('jsonwebtoken');
const dbName = 'web_db';



async function handleSettingsRequest(req, res) {
  const client = getClient();

  try {
    
    await client.connect();
    console.log('Connected to the database');

    
    const cookieHeader = req.headers.cookie;

    
    const token = parseCookie(cookieHeader, 'token');
    const secretKey = 'your_secret_key_here';

    
    const decodedToken = jwt.verify(token, secretKey);
    if (!decodedToken) {
      console.log('Invalid token');
      res.writeHead(401, { 'Content-Type': 'text/html' });
      res.write('<h1>Invalid token</h1>');
      res.end();
      return;
    }

    
    const userEmail = decodedToken.email;

    const collection = client.db(dbName).collection('users');

    
    const user = await collection.findOne({ email: userEmail });

    if (!user) {
      console.log('User not found');
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.write('<h1>User not found</h1>');
      res.end();
      return;
    }

    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const { darkModeToggle } = JSON.parse(body);
        console.log('Dark mode toggle value:', darkModeToggle);

        
        user.mode = darkModeToggle === true;
        await collection.updateOne({ email: userEmail }, { $set: { mode: darkModeToggle } });

        console.log('Dark mode updated successfully');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h1>Dark mode updated successfully</h1>');
        res.end();
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
      }
    });
  } catch (error) {
    console.error('Error updating dark mode:', error);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.write('<h1>Internal Server Error</h1>');
    res.end();
  } finally {
    
    // await client.close();
    // console.log('Disconnected from the database');
  }
}

  
  
  function parseCookie(cookieHeader, cookieName) {
    if (cookieHeader) {
      const cookies = cookieHeader.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
          return value;
        }
      }
    }
    return undefined;
  }
  

module.exports = { handleSettingsRequest };*/


/*async function handleSettingsRequest(req, res) {
  let client; // Declare the client variable outside the try block

  try {
    const { darkModeToggle } = req.body;

    const token = req.headers.cookie.split('=')[1]; // Assuming the token is stored in a cookie named 'token'
    const secretKey = 'your_secret_key_here';

    console.log('Received token:', token);//


    // Verify the JWT token
    const decodedToken = jwt.verify(token, secretKey);

    console.log('Decoded token:', decodedToken);

    if (!decodedToken) {
      console.log('Invalid token');
      res.writeHead(401, { 'Content-Type': 'text/html' });
      res.write('<h1>Invalid token</h1>');
      res.end();
      return;
    }

    const email = decodedToken.email;
    client = getClient(); // Initialize the client variable
    await client.connect();

    const collection = client.db(dbName).collection('users');
    const user = await collection.findOne({ email });

    if (!user) {
      console.log('User not found');
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.write('<h1>User not found</h1>');
      res.end();
      return;
    }

    user.mode = darkModeToggle === 'true';
    await collection.updateOne({ email }, { $set: { mode: user.mode } });

    console.log('Dark mode updated successfully');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Dark mode updated successfully</h1>');
    res.end();
  } catch (error) {
    console.error('Error updating dark mode:', error);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.write('<h1>Internal Server Error</h1>');
    res.end();
  } finally {
    if (client) {
      await client.close();
    }
  }
}*/


/*const { getClient } = require('../util/db');
const jwt = require('jsonwebtoken');

async function handleSettingsRequest(req, res) {
  try {
    const { darkModeToggle } = req.body;

    const token = req.headers.cookie.split('=')[1]; // Assuming the token is stored in a cookie named 'token'
    const secretKey = 'your_secret_key_here';

    // Verify the JWT token
    const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken) {
      console.log('Invalid token');
      res.writeHead(401, { 'Content-Type': 'text/html' });
      res.write('<h1>Invalid token</h1>');
      res.end();
      return;
    }

    const email = decodedToken.email;
    const client = getClient();
    await client.connect();

    const collection = client.db(dbName).collection('users');
    const user = await collection.findOne({ email });

    if (!user) {
      console.log('User not found');
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.write('<h1>User not found</h1>');
      res.end();
      return;
    }

    user.mode = darkModeToggle === 'true';
    await collection.updateOne({ email }, { $set: { mode: user.mode } });

    console.log('Dark mode updated successfully');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Dark mode updated successfully</h1>');
    res.end();
  } catch (error) {
    console.error('Error updating dark mode:', error);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.write('<h1>Internal Server Error</h1>');
    res.end();
  } finally {
    await client.close();
  }
}

module.exports = { handleSettingsRequest };*/


/*const { getClient } = require('../util/db');
async function handleSettingsRequest(req, res) {
    try {
     const darkModeToggle = req.body.darkModeToggle;
  
      const client = getClient();
      const database = client.db('web_db');
      const usersCollection = database.collection('users');
  
      const user = await usersCollection.findOne({ _id: req.session.userId });
  
      if (user) {
        user.mode = darkModeToggle === 'true';
        await usersCollection.updateOne({ _id: req.session.userId }, { $set: { mode: user.mode } }); 
      }
  
      res.writeHead(302, { Location: '/settings' });
      res.end();
  
    } catch (error) {
      console.log(error);
      
      res.writeHead(302, { Location: '/settings' });
      res.end();
    }
  }

module.exports = {handleSettingsRequest};*/


/*const fs = require('fs');
const { MongoClient } = require('mongodb');
const querystring = require('querystring');
const { saveUserPreference } = require('../util/db');


const url = 'mongodb://127.0.0.1:27017';
const dbName = 'web_db';


const collectionName = 'users';
const sessionField = 'session_id';

async function handleSettingsRequest(req, res) {
  if (req.method === 'GET') {
    if (req.url === '/settings.html') {
      
      fs.readFile('./settings.html', (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Internal Server Error');
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      });
    } else {
      
      try {
        const data = await readFileAsync(`.${req.url}`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      } catch (err) {
        res.statusCode = 404;
        res.end('File Not Found');
      }
    }
  } else if (req.method === 'POST') {
    
    if (req.url === '/settings') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
  
      req.on('end', () => {
        const formData = querystring.parse(body);
        const { darkMode } = formData;
        
        
        const currentUser = getCurrentUser(req);
        
        
        saveUserPreference(currentUser, { darkMode });
  
        res.statusCode = 302;
        res.setHeader('Location', '/settings.html');
        res.end();
      });
    }
  }
}

function readFileAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
  
      resolve(data);
    });
  });
}

async function getCurrentUser(req) {
  
  const sessionId = req.headers['session-id'];

  
  const client = new MongoClient(url);
  await client.connect();

  try {
    
    const db = client.db(dbName);

    
    const user = await db.collection(collectionName).findOne({ [sessionField]: sessionId });

    return user;
  } finally {
    
    await client.close();
  }
}

async function saveUserPreference(user, preferences) {
    
    const client = new MongoClient(url);
    await client.connect();
  
    try {
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
  
      
      await collection.updateOne({ _id: user._id }, { $set: { preferences } });
    } finally {
      await client.close();
    }
  }
  

module.exports = {
  handleSettingsRequest,
  saveUserPreference
};*/
