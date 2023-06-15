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
        const originCollection = db.collection('clima');
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
        return covering.name;
    } catch (error) {
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
  
      const animalOriginQuery = { animal_id:new ObjectId( animalId)};
      const animalOrigins = await animalOriginCollection.find(animalOriginQuery).toArray();
      const originIds = animalOrigins.map((animalOrigin) => new ObjectId(animalOrigin.origin_id));
      const originQuery = { _id: { $in: originIds } };
      const originProjection = { name: 1 };
      const originNames = await originsCollection.find(originQuery).project(originProjection).toArray();
  
      return originNames.map((origin) => origin.name);
    } catch (error) {
      console.error('Error retrieving origin names:', error);
      throw error;
    } finally {
      client.close();
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