const dbName = 'web_db';
const {getClient} = require('../util/db');
const {URL} = require('url');
const {ObjectId} = require('mongodb');

async function getAnimals(criteria) {
    const client = getClient();
    let animalsCache = null;
    try {
        await client.connect();
        const db = client.db(dbName);
        const animalsCollection = db.collection('animals');
       if(criteria == null)
         criteria = {};
         else{
         for (const key in criteria) {
            if (Object.prototype.hasOwnProperty.call(criteria, key)) {
              const value = criteria[key];
              // Transform the value into a new ObjectId instance
              criteria[key] = new ObjectId(value);
            }}}
            const animals = await animalsCollection.find(criteria).toArray();
        return animals;
    } catch (error) {
        console.error('Error retrieving animals:', error);
        throw error;
    }
}

getAnimals()
    .then(animals => {


    })
    .catch(error => {
        console.error('Error retrieving animals:', error);
    });

module.exports = {getAnimals};