
const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017/web_db';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);

  }
}

function getClient() {
  return client;
}

module.exports = { connectToDatabase, getClient };
