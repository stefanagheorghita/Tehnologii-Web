const { getClient } = require('../util/db');
const url = require('url');
const querystring = require('querystring');



async function handleSettingsRequest(req, res) {
    try {
      const { darkModeToggle } = req.body;
      const sessionId = req.sessionId;
  
      
      const user = await getUserBySessionId(sessionId);
  
      if (user) {
        user.mode = darkModeToggle === 'true';
        await updateUser(user);
      }
  
      res.writeHead(302, { Location: '/settings' });
      res.end();
    } catch (error) {
      console.log(error);
  
      res.writeHead(302, { Location: '/settings' });
      res.end();
    }
  }
  
/*async function handleSettingsRequest(req, res) {
  try {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const { darkModeToggle } = querystring.parse(body);

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
    });
  } catch (error) {
    console.log(error);

    res.writeHead(302, { Location: '/settings' });
    res.end();
  }
}*/

module.exports = { handleSettingsRequest };











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
