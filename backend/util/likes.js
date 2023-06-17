const {  ObjectId } = require('mongodb');
const { getClient } = require('./db');
const {getAnimalByIdFromDatabase}=require('../animals/animalsByIdDatabase');
const {verifyToken}=require('./token');
const dbName = 'web_db';

async function updateAnimalLikes(userId,animalId, updatedLikes) {
  const client = getClient();

  try {
    const db = client.db('web_db');
    const res=await db.collection('animals').findOne({ _id: new ObjectId(animalId) });
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
    const uId=new ObjectId(userId);
    const aId=new ObjectId(animalId);
    const likeAdd = {
        user_id: uId,
        animal_id: aId
      };
      const collection=db.collection('user_likes');
      if(updatedLikes==1)
      {collection.insertOne(likeAdd)
        .then(result => {
          console.log('Like added successfully');
        })
        .catch(error => {
          console.log('Failed to add like:', error);
        });}
        else
        if(updatedLikes==0)
        {
            collection.deleteOne({ user_id: uId, animal_id: aId })
            .then(result => {
                console.log('Like added successfully');
              })
              .catch(error => {
                console.log('Failed to add like:', error);
              });
        }
    
    return { success: true, message: 'Animal likes updated successfully' };
  } catch (error) {
    console.error('Error updating animal likes:', error);
    return { success: false, message: 'Failed to update animal likes' };
  } finally {

  }
}

async function verifyIfUserLiked(req, res) {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.slice(14);
        if (!verifyToken(token)) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({error: 'Unauthorized'}));
        }
        else
        {
            const dec = verifyToken(token);
            const userId = dec.id;
           // const user = await getUserFromDatabase(userId);
            const animalId = req.url.split('/')[2];
           // const animal = await getAnimalByIdFromDatabase(animalId);
            const db=client.db(dbName);
            const collection = db.collection('user_likes');
            const uId=new ObjectId(userId);
            const aId=new ObjectId(animalId);
            
            collection.findOne({ user_id: uId, animal_id: aId })
          .then(like => {
          if (like) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ isClicked: true }));
         } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ isClicked: false }));
        }
       })
      .catch(error => {
     console.log('Error:', error);
     });
        }  
     }
}
async function getLikesCount(req, res) {
    try {
      const db = client.db('web_db');
      const animalId = req.url.split('/')[2];
      const animal = await db.collection('animals').findOne({ _id: new ObjectId(animalId) });
      const likesCount = animal.likes;
      const responseData = { likesCount };
      const responseJSON = JSON.stringify(responseData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(responseJSON);
      res.end();
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      const errorResponse = JSON.stringify({ error: 'Failed to fetch likes count' });
      res.write(errorResponse);
      res.end();
    }
  }
  
  
module.exports = { updateAnimalLikes,verifyIfUserLiked,getLikesCount };