const { getClient } = require('./db');
const { ObjectId } = require('mongodb');

const dbName = 'web_db';

async function getDietByIdFromDatabase(id) {
    const client = getClient();
    try {
        const db = client.db(dbName);
        const dietCollection = db.collection('diet');
        const diet = await dietCollection.findOne({ _id: new ObjectId(id) });
        return diet.name;
    } catch (error) {
        console.error('Error retrieving diet by ID:', error);
        throw error;
    }
}

async function getStatusByIdFromDatabase(id) {
    const client = getClient();
    try {
        const db = client.db(dbName);
        const statusCollection = db.collection('status');
        const status = await statusCollection.findOne({ _id: new ObjectId(id) });
        return status.name;
    } catch (error) {
        console.error('Error retrieving status by ID:', error);
        throw error;
    }
}

async function getClimaByIdFromDatabase(id) {
    const client = getClient();
    try {
        const db = client.db(dbName);
        const climaCollection = db.collection('clima');
        const clima = await climaCollection.findOne({ _id: new ObjectId(id) });
        return clima.name;
    } catch (error) {
        console.error('Error retrieving clima by ID:', error);
        throw error;
    }
}

async function getReproductionByIdFromDatabase(id) {
    const client = getClient();
    try {
        const db = client.db(dbName);
        const reproductionCollection = db.collection('reproduction');
        const reproduction = await reproductionCollection.findOne({ _id: new ObjectId(id) });
        return reproduction.name;
    } catch (error) {
        console.error('Error retrieving reproduction by ID:', error);
        throw error;
    }
}

async function getTypeByIdFromDatabase(id) {
    const client = getClient();
    try {
        const db = client.db(dbName);
        const typeCollection = db.collection('type');
        const type = await typeCollection.findOne({ _id: new ObjectId(id) });
        return type.name;
    } catch (error) {
        console.error('Error retrieving type by ID:', error);
        throw error;
    }
}

async function getCoveringByIdFromDatabase(id) {
    const client = getClient();
    try {
       
        const db = client.db(dbName);
        const coveringCollection = db.collection('covering');
        const covering = await coveringCollection.findOne({ _id: new ObjectId(id) });
        return covering.name;
    } catch (error) {
        console.error('Error retrieving covering by ID:', error);
        throw error;
    }
}

async function getDangerByIdFromDatabase(id) {
    const client = getClient();
    try {
        await client.connect();

        const db = client.db(dbName);
        const dangerousnessCollection = db.collection('dangerousness');
        const dangerousness = await dangerousnessCollection.findOne({ _id: new ObjectId(id) });
        return dangerousness.name;
    } catch (error) {
        console.error('Error retrieving dangerousness by ID:', error);
        throw error;
    }
}

//////for users
async function getUserFromDatabase(id){
    const client=getClient();
    try{
     
        const db=client.db(dbName);
        const userCollection=db.collection('users');
        const user=await userCollection.findOne({ _id: new ObjectId(id) });
        console.log(user);
        return user;
    } catch (error) {
        console.error('Error retrieving dangerousness by ID:', error);
        throw error;
    }
    
}


module.exports = { getDietByIdFromDatabase, 
                   getStatusByIdFromDatabase, 
                   getClimaByIdFromDatabase,
                   getReproductionByIdFromDatabase,
                   getTypeByIdFromDatabase,
                   getCoveringByIdFromDatabase,
                   getDangerByIdFromDatabase,
                   getUserFromDatabase
                 };