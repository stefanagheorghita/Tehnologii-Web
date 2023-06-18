const {getAnimalByIdFromDatabase} = require('../animals/animalsByIdDatabase');
const {
    getStatusName,
    getClimaName,
    getDietName,
    getTypeName,
    getDangerousnessName,
    getCoveringName,
    getReproductionName,
    getOriginNames
} = require('../util/findInfoDatabase');
const {getAnimals} = require('../animals/animalsDatabase');
const {searchAnimals} = require('../animals/searchAnimals');
async function populate(animalId) {
    try {
        const originNames = await getOriginNames(animalId);
        const animalData = await getAnimalByIdFromDatabase(animalId);
        const statusName = await getStatusName(animalData.status_id);
        const climaName = await getClimaName(animalData.clima_id);
        const reproductionName = await getReproductionName(animalData.reproduction_id);
        const typeName = await getTypeName(animalData.type_id);
        const coveringName = await getCoveringName(animalData.covering_id);
        const dangerousnessName = await getDangerousnessName(animalData.dangerousness_id);
        const dietName = await getDietName(animalData.diet_id);
        animalData.status_name = statusName;
        animalData.diet_name = dietName;
        animalData.clima_name = climaName;
        animalData.reproduction_name = reproductionName;
        animalData.type_name = typeName;
        animalData.covering_name = coveringName;
        animalData.dangerousness_name = dangerousnessName;
        animalData.origin_names = originNames;

        return animalData;
    } catch (error) {
        console.error('Error retrieving animal by ID:', error);
        throw error;
    }
}


async function exportJson(animalId, req, res) {
    try {

        const animalData = await populate(animalId);
        const jsonResponse = JSON.stringify(animalData);

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(jsonResponse);
    } catch (error) {
        console.log(error);
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 Not Found');
    }
}

async function exportXml(animalId, req, res) {
    const animalData = await populate(animalId);
    const xmlData = createAnimalXML(animalData);

    res.writeHead(200, {'Content-Type': 'application/xml'});
    res.end(xmlData);

}


function createAnimalXML(animalData) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<animal>\n';

    for (const key in animalData) {
        if (key === 'origin_names') {
            xml += '<origin_names>\n';
            animalData[key].forEach((originName) => {
                xml += `<origin>${originName}</origin>\n`;
            });
            xml += '</origin_names>\n';
        } else {
            xml += `<${key}>${animalData[key]}</${key}>\n`;
        }
    }

    xml += '</animal>';
    return xml;
}

async function moreAnimalsExport(criteria, req, res) {

    let allAnimals = [];
    if('search' in criteria){
        const searchTerm=criteria['search'];
         allAnimals= await searchAnimals(searchTerm,1);
    }
    else{
    const Animals = await getAnimals(criteria);
    const promises = Animals.map(animal => populate(animal._id));
     allAnimals = await Promise.all(promises);
    }
    if (req.url.startsWith('/json')) {
        const jsonResponse = JSON.stringify(allAnimals);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(jsonResponse);
    }
    else if(req.url.startsWith('/xml')){
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<animals>\n';
        allAnimals.forEach(animal => {
            xml += '<animal>\n';
            for (const key in animal) {
                if (key === 'origin_names') {
                    xml += '<origin_names>\n';
                    animal[key].forEach((originName) => {
                        xml += `<origin>${originName}</origin>\n`;
                    });
                    xml += '</origin_names>\n';
                } else {
                    xml += `<${key}>${animal[key]}</${key}>\n`;
                }
            }
            xml += '</animal>\n';
        });
        xml += '</animals>';
        res.writeHead(200, {'Content-Type': 'application/xml'});
        res.end(xml);
    }
    else if(req.url.startsWith('/csv')){
    
      const csvData = createCSVData(allAnimals);
      const csvContent = createCSVContent(csvData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=animal.csv');
      res.write(csvContent);
      res.end();

    }
}

function createCSVData(animalData) {
  const csvData = [
    ['_id', 'name', 'image', 'scientific_name', 'description', 'lifespan', 'lifestyle', 'natural_enemies',
      'related_species', 'origin_names', 'status_name', 'diet_name', 'reproduction_name', 'type_name',
      'covering_name', 'dangerousness_name','gallery_images']
  ];
  

  for (const animal of animalData) {
    const {
      _id,
      name,
      image,
      scientific_name,
      description,
      lifespan,
      lifestyle,
      natural_enemies,
      related_species,
      origin_names,
      status_name,
      diet_name,
      reproduction_name,
      type_name,
      covering_name,
      dangerousness_name,
        gallery_images
    } = animal;
  
    const originString = Array.isArray(origin_names) ? origin_names.join(', ') : origin_names;
  
    const row = [
      _id,
      name,
      image,
      scientific_name,
      description,
      lifespan,
      lifestyle,
      natural_enemies,
      related_species,
      originString,
      status_name,
      diet_name,
      reproduction_name,
      type_name,
      covering_name,
      dangerousness_name,
        gallery_images
    ];
  
    csvData.push(row);
  }
  
  return csvData;
  
}

function createCSVContent(data) {
  const csvContent = data.map(row => row.join(',')).join('\n');
  return csvContent;
}

module.exports = {exportJson, exportXml, moreAnimalsExport}
