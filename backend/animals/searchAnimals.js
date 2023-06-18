const {getClient} = require('../util/db');
const {ObjectId} = require('mongodb');

async function searchAnimals(searchTerm, flag) {
    const client = getClient();
    try {
        const db = client.db('web_db');
        const animalsCollection = db.collection('animals');

        const searchTermRegex = new RegExp(searchTerm, 'i');
        let searchQuery = {};
        let phraseRegex = /animals?\s+with\s+([\w\s]+)(?:\s+or\s+([\w\s]+))?/i;
        let phraseMatch = searchTerm.match(phraseRegex);
        //cand cautam animal sau animals le afisam pe toate
        if (searchTerm.toLowerCase() === 'animal' || searchTerm.toLowerCase() === 'animals') {

            searchQuery = {};
            //afisam daca are blana/solzi etc, putem pune si cu sau intre ele
        } else if (phraseMatch) {
            const coverings = phraseMatch[1]
                .split(/\s+or\s+/i)
                .map(covering => covering.trim());

            const coveringQuery = {
                name: {$in: coverings.map(covering => new RegExp(covering, 'i'))},
            };

            const coveringProjection = {_id: 1};
            const coveringIds = await db.collection('covering').find(coveringQuery).project(coveringProjection).toArray();
            const coveringIdsArray = coveringIds.map(covering => covering._id);

            searchQuery.covering_id = {$in: coveringIdsArray};
        } else { //in functie de dieta
            phraseRegex = /animals?\s+(?:that\s+)?(?:eat|eats)\s+(\w+)/i;
            phraseMatch = searchTerm.match(phraseRegex);
            if (phraseMatch) {
                const diet = phraseMatch[1].trim();

                let dietIds;
                if (diet === 'meat') {
                    dietIds = await db.collection('diet').find({name: 'Carnivore'}).project({_id: 1}).toArray();
                } else if (diet === 'plants' || diet === 'vegetables' || diet === 'herbs' || diet === 'herb' || diet === 'grass' || diet === 'leaves' || diet === 'plant') {
                    dietIds = await db.collection('diet').find({name: 'Herbivore'}).project({_id: 1}).toArray();
                } else if (diet === 'fruits' || diet === 'fruit') {
                    dietIds = await db.collection('diet').find({name: 'Frugivore'}).project({_id: 1}).toArray();
                } else if (diet === 'meat and plants' || diet === 'meat and vegetables' || diet === 'anything') {
                    dietIds = await db.collection('diet').find({name: 'Omnivore'}).project({_id: 1}).toArray();
                } else if (diet === 'insects' || diet === 'insect') {
                    dietIds = await db.collection('diet').find({name: 'Insectivore'}).project({_id: 1}).toArray();
                } else if (diet === 'fish') {
                    dietIds = await db.collection('diet').find({name: 'Piscivore'}).project({_id: 1}).toArray();
                } else if (diet === 'grains' || diet === 'grain') {
                    dietIds = await db.collection('diet').find({name: 'Granivore'}).project({_id: 1}).toArray();
                } else {
                    searchQuery.diet_id = [];
                }

                if (dietIds && dietIds.length > 0) {
                    const dietIdsArray = dietIds.map(diet => diet._id);
                    searchQuery.diet_id = {$in: dietIdsArray};
                }
            } else {
                // de unde provin
                const continentRegex = /animals?\s+from\s+(\w+)/i;
                const continentMatch = searchTerm.match(continentRegex);
                if (continentMatch) {
                    const continent = continentMatch[1].trim();

                    const originQuery = {name: {$regex: new RegExp(continent, 'i')}};
                    const originProjection = {_id: 1};
                    const originIds = await db.collection('origin').find(originQuery).project(originProjection).toArray();
                    const originIdsArray = originIds.map(origin => origin._id);
                    const animalOriginQuery = {origin_id: {$in: originIdsArray}};
                    const animalOriginProjection = {animal_id: 1};
                    const animalOriginIds = await db.collection('animal_origin').find(animalOriginQuery).project(animalOriginProjection).toArray();
                    const animalIdsArray = animalOriginIds.map(animalOrigin => animalOrigin.animal_id);

                    searchQuery._id = {$in: animalIdsArray};
                } else {
                    // o categorie de animal cu locul de unde provine( ex: reptile din africa)
                    const typeContinentRegex = /(\w+)\s+from\s+(\w+)/i;
                    const typeContinentMatch = searchTerm.match(typeContinentRegex);
                    if (typeContinentMatch) {
                        const type = typeContinentMatch[1].trim();
                        const continent = typeContinentMatch[2].trim();

                        const typeQuery = {name: {$regex: new RegExp(type.replace(/s$/, 's?'), 'i')}};
                        const statusQuery = {name: {$regex: new RegExp(type, 'i')}};
                        const typeProjection = {_id: 1};
                        const typeIds = await db.collection('type').find(typeQuery).project(typeProjection).toArray();
                        const dietIds = await db.collection('diet').find(typeQuery).project(typeProjection).toArray();
                        const statusIds = await db.collection('status').find(statusQuery).project(typeProjection).toArray();
                        const typeIdsArray = typeIds.map(type => type._id);
                        const dietIdsArray = dietIds.map(diet => diet._id);
                        const statusIdsArray = statusIds.map(status => status._id);
                        const originQuery = {name: {$regex: new RegExp(continent, 'i')}};
                        const originProjection = {_id: 1};
                        const originIds = await db.collection('origin').find(originQuery).project(originProjection).toArray();
                        const originIdsArray = originIds.map(origin => origin._id);
                        const animalOriginQuery = {origin_id: {$in: originIdsArray}};
                        const animalOriginProjection = {animal_id: 1};
                        const animalOriginIds = await db.collection('animal_origin').find(animalOriginQuery).project(animalOriginProjection).toArray();
                        const animalIdsArray = animalOriginIds.map(animalOrigin => animalOrigin.animal_id);
                        searchQuery.$or = [
                            {type_id: {$in: typeIdsArray}},
                            {diet_id: {$in: dietIdsArray}},
                            {status_id: {$in: statusIdsArray}},
                        ];
                        searchQuery._id = {$in: animalIdsArray};
                    } else {
                        //cautari simple: efectiv numele, categoria(mamifere etc), dieta(carnivore etc), status(vulnerable etc)
                        const typeRegex = new RegExp(searchTerm.replace(/s$/, 's?'), 'i');
                        const typeQuery = {name: {$regex: typeRegex}};
                        const typeProjection = {_id: 1};
                        const typeIds = await db.collection('type').find(typeQuery).project(typeProjection).toArray();
                        const typeIdsArray = typeIds.map(type => type._id);
                        const dietIds = await db.collection('diet').find(typeQuery).project(typeProjection).toArray();
                        const dietIdsArray = dietIds.map(diet => diet._id);
                        const statusIds = await db.collection('status').find(typeQuery).project(typeProjection).toArray();
                        const statusIdsArray = statusIds.map(status => status._id);
                        searchQuery.$or = [
                            {name: searchTermRegex},
                            {type_id: {$in: typeIdsArray}},
                            {diet_id: {$in: dietIdsArray}},
                            {status_id: {$in: statusIdsArray}},
                            {flag: searchTermRegex}
                        ];
                    }
                }
            }
        }
        if (flag === 0) {
            const projection = {name: 1, image: 1, _id: 1};
            const animals = await animalsCollection.find(searchQuery).project(projection).toArray();
            return animals;
        } else {
            const animals = await animalsCollection.find(searchQuery).toArray();
            return animals;
        }

    } catch (error) {
        console.error('Error searching animals:', error);
    } finally {

    }
}


module.exports = {searchAnimals};