const {  ObjectId } = require('mongodb');
const { getClient } = require('./db');
const dbName = 'web_db';

async function updateAnimalLikes(animalId, updatedLikes) {
  const client = getClient();

  try {

    const db = client.db('animals');
    const res=await db.collection('animals').findOne({ _id: new ObjectId(animalId) });
    console.log(res);
    let like;
    if(updatedLikes==1)
         like=res.likes+1;
    else
        like=res.likes-1;
    const result = await db.collection('animals').updateOne(
      { _id: new ObjectId(animalId) },
      { $set: { likes: like } }
    );

    if (result.modifiedCount === 0) {
      return { success: false, message: 'Animal not found' };
    }

    return { success: true, message: 'Animal likes updated successfully' };
  } catch (error) {
    console.error('Error updating animal likes:', error);
    return { success: false, message: 'Failed to update animal likes' };
  } finally {

  }
}

module.exports = { updateAnimalLikes };