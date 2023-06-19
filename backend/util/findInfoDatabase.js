const {getClient} = require('./db');
const {ObjectId} = require('mongodb');
const dbName = 'web_db';

async function getStatusName(id) {
    const client = getClient();
    try {
        await client.connect();
        const db = client.db(dbName);
        const statusCollection = db.collection('status');
        const status = await statusCollection.findOne({_id: new ObjectId(id)});
        if(status==null){
            return "No status";
        }
        return status.name;
    } catch (error) {
        console.error('Error retrieving status name:', error);
        throw error;
    }
}

async function getDietName(id) {

    const client = getClient();
    try {
        await client.connect();
        const db = client.db(dbName);
        const dietCollection = db.collection('diet');
        const diet = await dietCollection.findOne({_id: new ObjectId(id)});
        if(diet==null){
            return "No diet";
        }
        return diet.name;
    } catch (error) {
        console.error('Error retrieving diet name:', error);
        throw error;
    }

}

async function getClimaName(id) {
    const client = getClient();
    try {
        await client.connect();
        const db = client.db(dbName);
        const climaCollection = db.collection('clima');
        const clima = await climaCollection.findOne({_id: new ObjectId(id)});
        if(clima==null){
            return "No clima";
        }

        return clima.name;
    } catch (error) {
        console.error('Error retrieving origin name:', error);
        throw error;
    }
}

async function getReproductionName(id) {

    const client = getClient();
    try {
        await client.connect();
        const db = client.db(dbName);
        const reproductionCollection = db.collection('reproduction');
        const reproduction = await reproductionCollection.findOne({_id: new ObjectId(id)});
        if(reproduction==null){
            return "No reproduction";
        }
        return reproduction.name;
    } catch (error) {
        console.error('Error retrieving reproduction name:', error);
        throw error;
    }
}

async function getDangerousnessName(id) {
    const client = getClient();
    try {
        await client.connect();
        const db = client.db(dbName);
        const dangerousnessCollection = db.collection('dangerousness');
        const dangerousness = await dangerousnessCollection.findOne({_id: new ObjectId(id)});
        if(dangerousness==null){
            return "No dangerousness";
        }
        return dangerousness.name;
    } catch (error) {
        console.error('Error retrieving dangerousness name:', error);
        throw error;
    }

}

async function getTypeName(id) {
    const client = getClient();
    try {
        await client.connect();
        const db = client.db(dbName);
        const typeCollection = db.collection('type');
        const type = await typeCollection.findOne({_id: new ObjectId(id)});
        if(type==null){
            return "No type";
        }
        return type.name;
    } catch (error) {
        console.error('Error retrieving type name:', error);
        throw error;
    }
}

async function getCoveringName(id) {
    const client = getClient();
    try {
        await client.connect();
        const db = client.db(dbName);
        const coveringCollection = db.collection('covering');
        const covering = await coveringCollection.findOne({_id: new ObjectId(id)});
        if(covering==null){
            return "No covering";
        }
        return covering.name;
    } catch (error) {
        console.log('if' + id);
        console.error('Error retrieving covering name:', error);

        throw error;
    }
}

async function getOriginNames(animalId) {
    const client = getClient();
    try {
        await client.connect();
        const db = client.db(dbName);
        const animalOriginCollection = db.collection('animal_origin');
        const originsCollection = db.collection('origin');

        const animalOriginQuery = {animal_id: new ObjectId(animalId)};
        if(animalId==null){
            return "No origin";
        }

        const animalOrigins = await animalOriginCollection.find(animalOriginQuery).toArray();
        if(animalOrigins.length === 0) {
            return [];
        }
    
        const originIds = animalOrigins.map((animalOrigin) => new ObjectId(animalOrigin.origin_id));
        const originQuery = {_id: {$in: originIds}};
        const originProjection = {name: 1};
        const originNames = await originsCollection.find(originQuery).project(originProjection).toArray();

        return originNames.map((origin) => origin.name);
    } catch (error) {
        console.error('Error retrieving origin names:', error);
        throw error;
    } finally {

    }
}


module.exports = {
    getStatusName,
    getDietName,
    getClimaName,
    getReproductionName,
    getDangerousnessName,
    getTypeName,
    getCoveringName,
    getOriginNames
};