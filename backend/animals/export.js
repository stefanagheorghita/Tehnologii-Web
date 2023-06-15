const {getAnimalByIdFromDatabase}=require('./animalsByIdDatabase');
const {getStatusName,getClimaName,getDietName,getTypeName,getDangerousnessName,getCoveringName,getReproductionName,getOriginNames}=require('../util/findInfoDatabase');

async function exportJson(animalId, req, res) {
    try {
        const originNames = await getOriginNames(animalId);
      const animalData = await getAnimalByIdFromDatabase(animalId);
      const statusName = await getStatusName(animalData.status_id);
      const dietName = await getDietName(animalData.diet_id);
      const climaName = await getClimaName(animalData.clima_id);
      const reproductionName = await getReproductionName(animalData.reproduction_id);
      const typeName = await getTypeName(animalData.type_id);
      const coveringName = await getCoveringName(animalData.covering_id);
      const dangerousnessName = await getDangerousnessName(animalData.dangerousness_id);
       
      animalData.status_name = statusName;
      animalData.diet_name = dietName;
      animalData.clima_name = climaName;
      animalData.reproduction_name = reproductionName;
      animalData.type_name = typeName;
      animalData.covering_name = coveringName;
      animalData.dangerousness_name = dangerousnessName;
        animalData.origin_names = originNames;
  
      const jsonResponse = JSON.stringify(animalData);
  
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(jsonResponse);
    } catch (error) {
      console.log(error);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  }
  
async function exportXml(animalId,req,res){
   

        const originNames = await getOriginNames(animalId);
        const animalData = await getAnimalByIdFromDatabase(animalId);
        const statusName = await getStatusName(animalData.status_id);
        const dietName = await getDietName(animalData.diet_id);
        const climaName = await getClimaName(animalData.clima_id);
        const reproductionName = await getReproductionName(animalData.reproduction_id);
        const typeName = await getTypeName(animalData.type_id);
        const coveringName = await getCoveringName(animalData.covering_id);
        const dangerousnessName = await getDangerousnessName(animalData.dangerousness_id);
         
        animalData.status_name = statusName;
        animalData.diet_name = dietName;
        animalData.clima_name = climaName;
        animalData.reproduction_name = reproductionName;
        animalData.type_name = typeName;
        animalData.covering_name = coveringName;
        animalData.dangerousness_name = dangerousnessName;
          animalData.origin_names = originNames;
        const xmlData = createAnimalXML(animalData);
    
        res.writeHead(200, { 'Content-Type': 'application/xml' });
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
      
      module.exports={exportJson,exportXml}
