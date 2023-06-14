const dbName = 'web_db';
const {getClient} = require('../util/db');

async function getAnimals() {
    const client = getClient();
    let animalsCache = null;
    try {
        await client.connect();

        const db = client.db(dbName);

        const animalsCollection = db.collection('animals');
        const animals = await animalsCollection.find().toArray();
        animalsCache = animals;
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