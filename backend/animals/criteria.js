
const { getClient } = require('../util/db');

const dbName = 'web_db';

async function handleCriteriaRequest(req, res) {
  try {
  
    const client =getClient();
    await client.connect();

   
    const typeData = await fetchTypeData(client);
    const dietData = await fetchDietData(client);
    const climateData = await fetchClimateData(client);
    const coverData = await fetchCoverData(client);
    const reproductionData = await fetchReproductionData(client);
    const originData = await fetchOriginData(client);
    const statusData = await fetchStatusData(client);


    const criteriaData = {
        types: typeData,
        diets: dietData,
        climates: climateData,
        covers: coverData,
        reproduction: reproductionData,
        origins: originData,
        statuses: statusData
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(criteriaData));


  } catch (error) {
    console.error('Error fetching criteria data:', error);
    res.writeHead(500);
    res.end('Internal server error');
  }
}

async function fetchTypeData(client) {
    const db = client.db(dbName);
    const typeCollection = db.collection('type');
    return await typeCollection.find().toArray();
}

async function fetchOriginData(client) {
  const db = client.db(dbName);
  const zoneCollection = db.collection('origin');
  return await zoneCollection.find().toArray();
}


async function fetchClimateData(client) {
  const db = client.db(dbName);
  const climateCollection = db.collection('clima');
  return await climateCollection.find().toArray();
}

async function fetchCoverData(client) {

    const db = client.db(dbName);
    const coverCollection = db.collection('covering');
    return await coverCollection.find().toArray();
}

async function fetchDietData(client) {
    const db = client.db(dbName);
    const dietCollection = db.collection('diet');
    return await dietCollection.find().toArray();
}

async function fetchReproductionData(client) {
    const db = client.db(dbName);
    const reproductionCollection = db.collection('reproduction');
    return await reproductionCollection.find().toArray();
}

async function fetchStatusData(client) {
    const db = client.db(dbName);
    const statusCollection = db.collection('status');
    return await statusCollection.find().toArray();
}

module.exports = { handleCriteriaRequest };
