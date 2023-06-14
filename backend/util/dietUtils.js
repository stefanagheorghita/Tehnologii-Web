const { getClient } = require('../util/db');
const { ObjectId } = require('mongodb');

const dbName = 'web_db';

async function getDietByIdFromDatabase(id) {
    console.log('Am intrat in getDietByIdFromDatabase');
  const client = getClient();
  try {
    await client.connect();

    const db = client.db(dbName);
    const dietCollection = db.collection('diet');
    const diet = await dietCollection.findOne({ _id: new ObjectId(id) });
    console.log('Am returnat dieta:', diet.name);
    return diet.name;
  } catch (error) {
    console.error('Error retrieving diet by ID:', error);
    throw error;
  }
}

module.exports = { getDietByIdFromDatabase };