const {getClient} = require('../util/db');

async function searchAnimals(searchTerm) {
    const client = getClient();
    try {
      await client.connect();
      const db = client.db('web_db');
      const animalsCollection = db.collection('animals');
  
      const searchQuery = { name: { $regex: searchTerm, $options: 'i' } };
      const projection = { name: 1, image: 1, _id: 1 };
      const animals = await animalsCollection.find(searchQuery).project(projection).toArray();

      displaySearchResults(animals);
      return animals;
    } catch (error) {
      console.error('Error searching animals:', error);
     
    } finally {
      client.close();
    }
  }
  
  function displaySearchResults(animals) {
 
    console.log(animals);
  }
  
 module.exports = { searchAnimals };