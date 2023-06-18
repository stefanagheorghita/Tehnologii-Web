const { ObjectId } = require('mongodb');
const { getClient } = require('./db');

const client = getClient();

async function changeLanguage(language, id) {
  try {
    const database = client.db('web_db');
    const collection = database.collection('animals');

    const query = { _id: new ObjectId(id) };
    const projection = { [`description_${language}`]: 1 };

    const result = await collection.findOne(query, projection);

    if (result) {
      const description = result[`description_${language}`];
      return { description };
    } else {
      return null;
    }
  } finally {
  }
}

module.exports = { changeLanguage };
