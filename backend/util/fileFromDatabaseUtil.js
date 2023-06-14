const {MongoClient, ObjectId} = require('mongodb');
const {get} = require('mongoose');
const imageCache = {};
const {getClient} = require('./db');


async function getBackgroundImageFromDatabase(imageId) {
    if (imageCache[imageId]) {
        return imageCache[imageId];
    }

    const dbName = 'web_db';

    const client = getClient();

    try {
        await client.connect();
        const collection = client.db(dbName).collection('backgroundImages');
        const image = await collection.findOne({_id: new ObjectId(imageId)});
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

module.exports = {getBackgroundImageFromDatabase};
