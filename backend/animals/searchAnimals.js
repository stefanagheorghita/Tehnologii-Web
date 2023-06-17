const {getClient} = require('../util/db');

async function searchAnimals(searchTerm) {
    const client = getClient();
    try {
        await client.connect();
        const db = client.db('web_db');
        const animalsCollection = db.collection('animals');

        const searchQuery = {name: {$regex: searchTerm, $options: 'i'}};
        const projection = {name: 1, image: 1, _id: 1};
        const animals = await animalsCollection.find(searchQuery).project(projection).toArray();
        return animals;
    } catch (error) {
        console.error('Error searching animals:', error);

    } finally {

    }
}

async function searchAnimalsComplete(searchTerm) {
    const client = getClient();
    try {
        await client.connect();
        const db = client.db('web_db');
        const animalsCollection = db.collection('animals');

        const searchQuery = {name: {$regex: searchTerm, $options: 'i'}};
       
        const animals = await animalsCollection.find(searchQuery).toArray();
        return animals;
    } catch (error) {
        console.error('Error searching animals:', error);

    } finally {

    }
}


module.exports = {searchAnimals,searchAnimalsComplete};