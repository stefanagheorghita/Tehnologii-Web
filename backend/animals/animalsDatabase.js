const dbName = 'web_db';
const { getClient } = require('../util/db');
const { ObjectId } = require('mongodb');

async function getAnimals(criteria) {
  const client = getClient();
  let animalsCache = null;
  try {
    await client.connect();
    const db = client.db(dbName);
    const animalsCollection = db.collection('animals');
    if (criteria == null) {
      criteria = {};
    } else {
      for (const key in criteria) {
        if (Object.prototype.hasOwnProperty.call(criteria, key)) {
          const value = criteria[key];
          if (key === 'origin') {
            const originsCollection = db.collection('animal_origin');
            const originIds = Array.isArray(value) ? value.map((id) => new ObjectId(id)) : [new ObjectId(value)];
            const animalIds = await originsCollection.distinct('animal_id', { origin_id: { $in: originIds } });
            criteria['_id'] = { $in: animalIds };
            delete criteria[key];
          } else if (Array.isArray(value)) {
            const newKey = `${key}_id`;
            const objectIds = value.map((id) => new ObjectId(id));
            criteria[newKey] = { $in: objectIds };
            delete criteria[key];
          } else {
            const newKey = `${key}_id`;
            criteria[newKey] = new ObjectId(value);
            delete criteria[key];
          }
        }
      }
    }
    const projection = { name: 1, image: 1, _id: 1 };
    const animals = await animalsCollection.find(criteria).project(projection).toArray();
    return animals;
  } catch (error) {
    console.error('Error retrieving animals:', error);
    throw error;
  }
}

getAnimals()
  .then((animals) => {
    // Handle the retrieved animals here
  })
  .catch((error) => {
    console.error('Error retrieving animals:', error);
  });

module.exports = { getAnimals };
