const fs = require('fs');
const path = require('path');
const { replaceImageUrls } = require('./util/imageUtils');
const { includeAssets } = require('./util/cssUtils')
const { getBackgroundImageFromDatabase } = require('./util/fileFromDatabaseUtil');
const { getAnimals } = require('./animals/animalsDatabase');
const { getAnimalByIdFromDatabase } = require('./animals/animalsByIdDatabase');
const { getDietByIdFromDatabase } = require('./util/infoDatabaseUtil');
const { getStatusByIdFromDatabase } = require('./util/infoDatabaseUtil');
const { getClimaByIdFromDatabase } = require('./util/infoDatabaseUtil');
const { getReproductionByIdFromDatabase } = require('./util/infoDatabaseUtil');
const { getTypeByIdFromDatabase } = require('./util/infoDatabaseUtil');
const { getCoveringByIdFromDatabase } = require('./util/infoDatabaseUtil');
const { getDangerByIdFromDatabase } = require('./util/infoDatabaseUtil');
const { searchAnimals } = require('./animals/searchAnimals');


// for the landing page
function handleLandingPage(req, res) {
    const filePath = '../frontend/landingpage.html';

    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal server error');
        } else {

            const modifiedContent = includeAssets(content, filePath);
            replaceImageUrls(modifiedContent, (imgErr, modContent) => {
                if (imgErr) {
                    res.writeHead(500);
                    res.end('Internal server error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(modContent, 'utf-8');
                }
            });

        }
    });
}

// for the home page
function handleHomePage(req, res) {
    // const cookieHeader = req.headers.cookie;

    // if (cookieHeader) {
    //   const cookies = cookieHeader.split(';');

    //   for (const cookie of cookies) {

    //     if (cookie.trim().startsWith('token=')) {

    //       console.log('Token cookie found:');
    //     }}}
    const filePath = '../frontend/index.html';

    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal server error');
        } else {
            const modifiedContent = includeAssets(content, filePath);
            replaceImageUrls(modifiedContent, async (imgErr, modContent) => {
                if (imgErr) {
                    res.writeHead(500);
                    res.end('Internal server error');
                } else {
                    try {
                        const imageId = '64884885df77d90a8234a7f6';
                        const backgroundImage = await getBackgroundImageFromDatabase(imageId);
                        const updatedContent = modContent.replace("background-image: url('images/tigru2.jpg')", `background-image: url('${backgroundImage}')`);
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(updatedContent, 'utf-8');
                    } catch (error) {
                        res.writeHead(500);
                        res.end('Internal server error');
                    }
                }
            });
        }
    });
}

// for the login page
function handleLoginPage(req, res) {
    const filePath = '../frontend/user-account/login.html';
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
        } else {

            const modifiedContent = includeAssets(content, filePath);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(modifiedContent, 'utf-8');
        }
    });
}


// for the categories page
function handleGeneralAnimalPage(req, res) {
    const filePath = '../frontend/animals.html';

    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal server error');
        } else {
            const modifiedContent = includeAssets(content, filePath);
            replaceImageUrls(modifiedContent, async (imgErr, modContent) => {
                if (imgErr) {
                    res.writeHead(500);
                    res.end('Internal server error');
                } else {
                    try {
                        const imageId = '64886109df77d90a8234a7f7';
                        const backgroundImage = await getBackgroundImageFromDatabase(imageId);
                        const updatedContent = modContent.replace("background-image: url(../images/gorilla.jpg)", `background-image: url('${backgroundImage}')`);
                        const imageId2 = '64886238df77d90a8234a7f8';
                        const backgroundImage2 = await getBackgroundImageFromDatabase(imageId2);
                        const updatedContent2 = updatedContent.replace("background-image: url(../images/foot1.png)", `background-image: url('${backgroundImage2}')`);
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(updatedContent2, 'utf-8');
                    } catch (error) {
                        res.writeHead(500);
                        res.end('Internal server error');
                    }
                }
            });
        }
    });
}


//for the all animals page
function handleAllAnimalPage(req, res, criteria,searchTerm) {
    const filePath = '../frontend/all_animals.html';
    fs.readFile(filePath, 'utf8', async (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal server error');
        } else {
          
            const modifiedContent = includeAssets(content, filePath);

            const imageId = '64886109df77d90a8234a7f7';
            const backgroundImage = await getBackgroundImageFromDatabase(imageId);
            const updatedContent = modifiedContent.replace("background-image: url(../images/gorilla.jpg)", `background-image: url('${backgroundImage}')`);

            const imageId2 = '64886238df77d90a8234a7f8';
            const backgroundImage2 = await getBackgroundImageFromDatabase(imageId2);
            const updatedContent2 = updatedContent.replace("background-image: url(../images/foot1.png)", `background-image: url('${backgroundImage2}')`);
            try {
                let animals;
                if(searchTerm!==null)
                {
                    animals=await searchAnimals(searchTerm);
                }
                else{
                 animals = await getAnimals(criteria);}
                const animalCards = animals.map((animal) => {
        
                    const animalUrl = `/Animal?id=${animal._id}`;
                    return `
              <div class="about-col">
                <img src="${animal.image}" alt="${animal.name}">
                <div class="layer">
                    <a href="${animalUrl}">${animal.name}</a>
                </div>
              </div>
            `;
                });

                const updatedContent3 = updatedContent2.replace('<!-- AnimalCards -->', animalCards.join(''));

                replaceImageUrls(updatedContent3, async (imgErr, finalContent) => {
                    if (imgErr) {
                        res.writeHead(500);
                        res.end('Internal server error');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(finalContent, 'utf-8');
                    }
                });
            } catch (error) {
                res.writeHead(500);
                res.end('Internal server error');
            }
        }
    });
}


//for the one animal page

/*function handleOneAnimalPage(req, res, id) {
    const filePath = '../frontend/Animal.html';
    fs.readFile(filePath, 'utf8', async (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal server error');
        } else {
            const modifiedContent = includeAssets(content, filePath);
            replaceImageUrls(modifiedContent, async (imgErr, modContent) => {
                if (imgErr) {
                    res.writeHead(500);
                    res.end('Internal server error');
                } else {
                    try {
                        const animal = await getAnimalByIdFromDatabase(id);
                        const diet = await getDietByIdFromDatabase(animal.diet_id);
                        const status = await getStatusByIdFromDatabase(animal.status_id);
                        const clima = await getClimaByIdFromDatabase(animal.clima_id);
                        const reproduction = await getReproductionByIdFromDatabase(animal.reproduction_id);
                        const type = await getTypeByIdFromDatabase(animal.type_id);
                        const covering = await getCoveringByIdFromDatabase(animal.covering_id);
                        const danger = await getDangerByIdFromDatabase(animal.dangerousness_id);
                        //const imgTagPlaceholder = '<img src="images/animals_background/default_background.jpg" alt="animal background">';
                        //const imgTagReplacement = `<img src="${animal.background_image}" alt="animal background">`;
                        //console.log(imgTagPlaceholder);
                        //console.log(imgTagReplacement);
            
                        const updatedContent = modContent
                            .replace('Title Animal', animal.name)
                            .replace('exampleName', `${animal.name}`)
                            .replace('exampleGroup', `${type}`)
                            .replace('exampleClima', `${clima}`)
                            .replace('exampleDiet', `${diet}`)
                            .replace('exampleLifespan', `${animal.lifespan}`)
                            .replace('Information', animal.description)
                            .replace('exampleStatus', status)
                            .replace('exampleReproduction', reproduction)
                            .replace('exampleCovering', covering)
                            .replace('exampleLifestyle', animal.lifestyle)
                            .replace('exampleDangerousness', danger)
                            .replace('exampleRelatedSpecies', animal.related_species)
                            .replace('exampleNaturalEnemies', animal.natural_enemies)
                            .replace('images/animals_background/default_background.jpg', animal.background_image)
                            .replace('<img src="images/leut.png" alt="Lei">', `<img src="${animal.background_image}" alt="animal background">`)
                            console.log(`${animal.round_image}`);
                            console.log(animal.background_image);

                           // .replace(imgTagPlaceholder, imgTagReplacement);
                           // .replace("images/animals_background/default_background.jpg", `${animal.background_image}`);
                            //console.log(animal.background_image);
                            //console.log(`${animal.background_image}`);
                            
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(updatedContent, 'utf-8');
                    } catch (error) {
                        console.log(error);
                        res.writeHead(500);
                        res.end('Internal server error');
                    }
                }
            });
        }
    });
}*/

//---------------------------------------------------------------------------------------

/*async function handleOneAnimalPage(req, res, id) {
    const filePath = '../frontend/Animal.html';
    fs.readFile(filePath, 'utf8', async (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal server error');
        } else {
            const modifiedContent = includeAssets(content, filePath);

            try {
                const animal = await getAnimalByIdFromDatabase(id);
                const diet = await getDietByIdFromDatabase(animal.diet_id);
                const status = await getStatusByIdFromDatabase(animal.status_id);
                const clima = await getClimaByIdFromDatabase(animal.clima_id);
                const reproduction = await getReproductionByIdFromDatabase(animal.reproduction_id);
                const type = await getTypeByIdFromDatabase(animal.type_id);
                const covering = await getCoveringByIdFromDatabase(animal.covering_id);
                const danger = await getDangerByIdFromDatabase(animal.dangerousness_id);

                const updatedContent = modifiedContent
                    .replace('Title Animal', animal.name)
                    .replace('exampleName', animal.name)
                    .replace('exampleGroup', type)
                    .replace('exampleClima', clima)
                    .replace('exampleDiet', diet)
                    .replace('exampleLifespan', animal.lifespan)
                    .replace('Information', animal.description)
                    .replace('exampleStatus', status)
                    .replace('exampleReproduction', reproduction)
                    .replace('exampleCovering', covering)
                    .replace('exampleLifestyle', animal.lifestyle)
                    .replace('exampleDangerousness', danger)
                    .replace('exampleRelatedSpecies', animal.related_species)
                    .replace('exampleNaturalEnemies', animal.natural_enemies)
                    .replace('images/animals_background/default_background.jpg', animal.background_image)
                    .replace('images/leut.png', animal.round_image);

                replaceImageUrls(updatedContent, async (imgErr, finalContent) => {
                    if (imgErr) {
                        res.writeHead(500);
                        res.end('Internal server error');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(finalContent, 'utf-8');
                    }
                });
            } catch (error) {
                console.log(error);
                res.writeHead(500);
                res.end('Internal server error');
            }
        }
    });
}*/

//--------------------------------------------------------------------------------------------

async function handleOneAnimalPage(req, res, id) {
    const filePath = '../frontend/Animal.html';
    fs.readFile(filePath, 'utf8', async (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Internal server error');
      } else {
        const modifiedContent = includeAssets(content, filePath);
  
        try {
          const animal = await getAnimalByIdFromDatabase(id);
          const diet = await getDietByIdFromDatabase(animal.diet_id);
          const status = await getStatusByIdFromDatabase(animal.status_id);
          const clima = await getClimaByIdFromDatabase(animal.clima_id);
          const reproduction = await getReproductionByIdFromDatabase(animal.reproduction_id);
          const type = await getTypeByIdFromDatabase(animal.type_id);
          const covering = await getCoveringByIdFromDatabase(animal.covering_id);
          const danger = await getDangerByIdFromDatabase(animal.dangerousness_id);
  
          const updatedContent = modifiedContent
            .replace('Title Animal', animal.name)
            .replace('exampleName', animal.name)
            .replace('exampleGroup', type)
            .replace('exampleClima', clima)
            .replace('exampleDiet', diet)
            .replace('exampleLifespan', animal.lifespan)
            .replace('Information', animal.description)
            .replace('exampleStatus', status)
            .replace('exampleReproduction', reproduction)
            .replace('exampleCovering', covering)
            .replace('exampleLifestyle', animal.lifestyle)
            .replace('exampleDangerousness', danger)
            .replace('exampleRelatedSpecies', animal.related_species)
            .replace('exampleNaturalEnemies', animal.natural_enemies)
            .replace('images/animals_background/default_background.jpg', animal.background_image)
            .replace('images/leut.png', animal.round_image);
  
          const galleryImages = animal.gallery_images.split(',').map((image) => image.trim());
  
          const galleryImagesHTML = galleryImages
            .map((image) => `<img src="${image}" alt="animal image" class="gallery-image">`)
            .join('\n');
  
          const updatedContentWithGallery = updatedContent.replace(
            '<img src="images/images_all_animals/no.jpg" alt="imagine animal" class="gallery-image">',
            galleryImagesHTML
          );
  
          replaceImageUrls(updatedContentWithGallery, async (imgErr, finalContent) => {
            if (imgErr) {
              res.writeHead(500);
              res.end('Internal server error');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(finalContent, 'utf-8');
            }
          });
        } catch (error) {
          console.log(error);
          res.writeHead(500);
          res.end('Internal server error');
        }
      }
    });
  }


//for the zoo plan page
function handleZooPlanPage(req, res) {
    const filePath = '../frontend/zoo-plan/zoo-plan.html';

    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal server error');
        } else {

            const modifiedContent = includeAssets(content, filePath);
            replaceImageUrls(modifiedContent, (imgErr, modContent) => {
                if (imgErr) {
                    res.writeHead(500);
                    res.end('Internal server error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(modContent, 'utf-8');
                }
            });
        }
    });
}

//for the help page
function handleHelpPage(req, res) {
    const filePath = '../frontend/help-page/help.html';

    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal server error');
        } else {

            const modifiedContent = includeAssets(content, filePath);
            replaceImageUrls(modifiedContent, (imgErr, modContent) => {
                if (imgErr) {
                    res.writeHead(500);
                    res.end('Internal server error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(modContent, 'utf-8');
                }
            });
        }
    });
}


//for the about us page
function handleAboutUsPage(req, res) {
    const filePath = '../frontend/aboutUs.html';
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal server error');
        } else {

            const modifiedContent = includeAssets(content, filePath);
            replaceImageUrls(modifiedContent, (imgErr, modContent) => {
                if (imgErr) {
                    res.writeHead(500);
                    res.end('Internal server error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(modContent, 'utf-8');
                }
            });
        }
    });
}

//for the forgot password page
function handleForgotPasswordPage(req, res) {
    const filePath = '../frontend/user-account/forgot.html';

    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal server error');
        } else {

            const modifiedContent = includeAssets(content, filePath);
            replaceImageUrls(modifiedContent, (imgErr, modContent) => {
                if (imgErr) {
                    res.writeHead(500);
                    res.end('Internal server error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(modContent, 'utf-8');
                }
            });
        }
    });
}


//Program page
function handleProgramPage(req, res) {
    const filePath = '../frontend/program.html';

    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal server error');
        } else {

            const modifiedContent = includeAssets(content, filePath);
            replaceImageUrls(modifiedContent, (imgErr, modContent) => {
                if (imgErr) {
                    res.writeHead(500);
                    res.end('Internal server error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(modContent, 'utf-8');
                }
            });
        }
    });

}


function handleStaticFile(req, res) {
    const filePath = path.join(__dirname, 'frontend', req.url);
    const extension = path.extname(filePath).substring(1);
    const contentType = getContentType(extension);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Internal server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}

//for register page
function handleRegisterPage(req, res) {
    const filePath = '../frontend/user-account/signup.html';
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
        } else {

            const modifiedContent = includeAssets(content, filePath);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(modifiedContent, 'utf-8');
        }
    });
}


//for settings page
function handleSettingsPage(req, res) {
    const filePath = '../frontend/settings.html';
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal server error');
        } else {

            const modifiedContent = includeAssets(content, filePath);
            replaceImageUrls(modifiedContent, (imgErr, modContent) => {
                if (imgErr) {
                    res.writeHead(500);
                    res.end('Internal server error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(modContent, 'utf-8');
                }
            });

        }
    });
}

function getContentType(extension) {
    switch (extension) {
        case 'html':
            return 'text/html';
        case 'css':
            return 'text/css';
        case 'js':
            return 'text/javascript';
        case 'jpg':
            return 'image/jpg'
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        default:
            return 'application/octet-stream';
    }
}

function readCssFiles(cssFiles, callback) {
    let cssCount = 0;
    let cssContents = [];

    cssFiles.forEach((cssFilePath) => {
        fs.readFile(cssFilePath, 'utf8', (err, cssContent) => {
            cssCount++;
            if (err) {
                callback(err);
                return;
            }
            cssContents.push(cssContent);
            if (cssCount === cssFiles.length) {
                callback(null, cssContents);
            }
        });
    });
}

module.exports = {
    handleLandingPage,
    handleLoginPage,
    handleHomePage,
    handleGeneralAnimalPage,
    handleAllAnimalPage,
    handleZooPlanPage,
    handleAboutUsPage,
    handleRegisterPage,
    handleSettingsPage,
    handleRegisterPage,
    handleHelpPage,
    handleForgotPasswordPage,
    handleProgramPage,
    handleOneAnimalPage,
    handleStaticFile
};
