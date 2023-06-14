const http = require('http');
const router = require('./router');
const { connectToDatabase } = require('./util/db');
connectToDatabase();
const server = http.createServer(router);
const port = 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});









/*const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const { MongoClient } = require('mongodb');
const router = require('./router');
const { connectToDatabase } = require('./util/db');

// Set up the MongoDB connection
const client = new MongoClient('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    return;
  }

  // Database and collection names
  const dbName = 'mydb';
  const collectionName = 'users';

  console.log('Connected to MongoDB');

  // Function to update user preference in the database
  function saveUserPreference(formData) {
    const darkMode = formData.darkMode === 'on';

    // Replace with your MongoDB update operation
    client.db(dbName).collection(collectionName).updateOne(
      { _id: userId }, // Replace `userId` with the actual user ID
      { $set: { darkMode } }
    );
  }

  // Create a basic HTTP server
  const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
      // Handle GET requests

      if (req.url === '/settings.html') {
        // Serve the settings page
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
        // Serve other pages
        router(req, res); // Delegate handling other GET requests to your existing router
      }
    } else if (req.method === 'POST') {
      // Handle POST requests

      if (req.url === '/settings') {
        // Parse the request body
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', () => {
          const formData = querystring.parse(body);

          // Update the user's preference in the database
          saveUserPreference(formData);

          // Redirect the user back to the settings page or any other desired page
          res.statusCode = 302;
          res.setHeader('Location', '/settings.html');
          res.end();
        });
      } else {
        // Delegate handling other POST requests to your existing router
        router(req, res);
      }
    }
  });

  // Start the server
  const port = 3000;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

// Connect to the database
connectToDatabase();*/












