const dbName = 'web_db';
const {getClient} = require('../util/db');
const { ObjectId } = require('mongodb');

async function getAnimalByIdFromDatabase(id) {
    const client = getClient();
    try {
      await client.connect();
  
      const db = client.db(dbName);
      const animalsCollection = db.collection('animals');
      const animal = await animalsCollection.findOne({ _id: new ObjectId(id) });

      return animal;
    } catch (error) {
      console.error('Error retrieving animal by ID:', error);
      throw error;
    }
  }
  
  module.exports = { getAnimalByIdFromDatabase };