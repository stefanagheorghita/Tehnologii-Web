const {getClient} = require('../util/db');
const url = require('url');
const dbName = 'web_db';
const client = getClient();
const messageSchema = {
    name: String,
    email: String,
    subject: String,
    message: String
  };


async function handleContactUsRequest(req, res) {
    const { pathname } = url.parse(req.url);

  if (req.method === 'POST' && pathname === '/contact') {
    let body = '';

    
    req.on('data', (data) => {
      body += data;
    });

    
    req.on('end', () => {
      
      //const formData = parseFormData(body);
      const formData = parseFormData(body);
      

      saveFormDataToDatabase(formData);

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Form submitted successfully');
    });
  } else {
    
    const filePath = './index.html';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading the file');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      }
    });
  }
}


function parseFormData(body) {
    const trimmedBody = body.trim(); 
    const jsonString = trimmedBody.slice(1, trimmedBody.length - 1); 
  
    const keyValuePairs = jsonString.split(',');
  
    const formData = {};
    keyValuePairs.forEach((pair) => {
      const [key, value] = pair.split(':');
      const trimmedKey = key.trim().slice(1, -1); 
      const trimmedValue = value.trim().slice(1, -1); 
      formData[trimmedKey] = trimmedValue;
    });
  
    return formData;
  }
  
  



function saveFormDataToDatabase(formData) {
   client.connect();

    //console.log('Connected successfully to the database');
    
    const db = client.db(dbName);
    const collection = db.collection('messages');

    collection.insertOne(formData, (err, result) => {
        if (err) {
          console.error('Error saving form data:', err);
        } else {
          console.log('Form data saved successfully:', result.insertedId);
        }
  
        
    });
}



module.exports = {handleContactUsRequest};