const {getClient} = require('../util/db');
const {ObjectId} = require('mongodb');

async function searchAnimals(searchTerm,flag) {
    const client = getClient();
    try {
      const db = client.db('web_db');
      const animalsCollection = db.collection('animals');
  
      const searchTermRegex = new RegExp(searchTerm, 'i');
      const searchQuery = {};
      const phraseRegex = /animals?\s+with\s+([\w\s]+)(?:\s+or\s+([\w\s]+))?/i;
        const phraseMatch = searchTerm.match(phraseRegex);
      if (phraseMatch) {
        const coverings = phraseMatch[1]
        .split(/\s+or\s+/i)
        .map(covering => covering.trim());

     const coveringQuery = {
    name: { $in: coverings.map(covering => new RegExp(covering, 'i')) },
     };

  const coveringProjection = { _id: 1 };
  const coveringIds = await db.collection('covering').find(coveringQuery).project(coveringProjection).toArray();
  const coveringIdsArray = coveringIds.map(covering => covering._id);

  searchQuery.covering_id = { $in: coveringIdsArray };
      }
       else {
        const typeRegex = new RegExp(searchTerm.replace(/s$/, 's?'), 'i');
        const typeQuery = { name: { $regex: typeRegex } };
        const typeProjection = { _id: 1 };
        const typeIds = await db.collection('type').find(typeQuery).project(typeProjection).toArray();
        const typeIdsArray = typeIds.map(type => type._id);
        const dietIds = await db.collection('diet').find(typeQuery).project(typeProjection).toArray();
        const dietIdsArray = dietIds.map(diet => diet._id);
        const statusIds = await db.collection('status').find(typeQuery).project(typeProjection).toArray();
        const statusIdsArray = statusIds.map(status => status._id);
        searchQuery.$or = [
          { name: searchTermRegex },
          { type_id: { $in: typeIdsArray } },
          { diet_id: { $in: dietIdsArray }},
          { status_id: { $in: statusIdsArray }}
        ];
      }
      if(flag==0){
      const projection = { name: 1, image: 1, _id: 1 };
      const animals = await animalsCollection.find(searchQuery).project(projection).toArray();
      return animals;}
        else{
            const animals = await animalsCollection.find(searchQuery).toArray();
            return animals;
        }
      
    } catch (error) {
      console.error('Error searching animals:', error);
    } finally {
     
    }
  }



module.exports = {searchAnimals};