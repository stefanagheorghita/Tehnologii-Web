const { MongoClient, ObjectId } = require('mongodb');
const imageCache = {};

async function getBackgroundImageFromDatabase(imageId) {
  if (imageCache[imageId]) {
    return imageCache[imageId];
  }

  const uri = 'mongodb://127.0.0.1:27017';
  const dbName = 'web_db';

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to the database');

    const collection = client.db(dbName).collection('backgroundImages');
    const image = await collection.findOne({ _id: new ObjectId(imageId) });
    if (image) {
      imageCache[imageId] = image.image;

      return image.image;
    } else {
      throw new Error('Image not found');
    }
  } catch (error) {
    console.error('Error retrieving background image:', error);
    throw error;
  } finally {
    await client.close();
  }
}

module.exports = { getBackgroundImageFromDatabase };