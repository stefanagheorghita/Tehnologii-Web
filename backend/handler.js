const fs = require('fs');
const path = require('path');
const {replaceImageUrls} = require('./util/imageUtils');
const {includeAssets} = require('./util/cssUtils')
const {getBackgroundImageFromDatabase} = require('./util/fileFromDatabaseUtil');
const {getAnimals} = require('./animals/animalsDatabase');
const {getAnimalByIdFromDatabase} = require('./animals/animalsByIdDatabase');
const {getDietByIdFromDatabase} = require('./util/infoDatabaseUtil');
const {getStatusByIdFromDatabase} = require('./util/infoDatabaseUtil');
const {getClimaByIdFromDatabase} = require('./util/infoDatabaseUtil');
const {getReproductionByIdFromDatabase} = require('./util/infoDatabaseUtil');
const {getTypeByIdFromDatabase} = require('./util/infoDatabaseUtil');
const {getCoveringByIdFromDatabase} = require('./util/infoDatabaseUtil');
const {getDangerByIdFromDatabase} = require('./util/infoDatabaseUtil');
const {getUserFromDatabase} = require('./util/infoDatabaseUtil');
const {verifyToken} = require('./util/token');
const {updateName, updateEmail, updatePassword} = require('./util/changeCredentials');
const { getAllUsersFromDatabase } = require('./util/infoDatabaseUtil');
const { getAllAnimalsFromDatabase } = require('./util/infoDatabaseUtil');
const { getAllReservationsFromDatabase } = require('./util/infoDatabaseUtil');
const { generateUsersTable } = require('./util/infoDatabaseUtil');
const { generateAnimalsTable } = require('./util/infoDatabaseUtil');
const { generateReservationsTable } = require('./util/infoDatabaseUtil');
//const { deleteButtonListeners } = require('./util/infoDatabaseUtil');
const { searchAnimals } = require('./animals/searchAnimals');

////
const {getClient} = require('./util/db');
const jwt = require('jsonwebtoken');
const { updateAnimalLikes } = require('./util/likes');
const dbName = 'web_db';
const client = getClient();

function renderPage(req, res, pageContent, mode) {
    // Read the contents of the dark-theme.css file
    fs.readFile('../frontend/dark-theme.css', 'utf8', (err, cssContent) => {
        if (err) {
            res.writeHead(500);
            res.end('Internal server error');
        } else {
            // Determine whether to include the dark-theme.css based on the mode value
            const styleTag = mode ? `<style>${cssContent}</style>` : '';

            const html = `
          <html>
            <head>
              ${styleTag}
              <!-- Other stylesheets and meta tags -->
            </head>
            <body>
              ${pageContent}
            </body>
          </html>
        `;

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        }
    });
}

////


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
                    res.writeHead(200, {'Content-Type': 'text/html'});
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
                        res.writeHead(200, {'Content-Type': 'text/html'});
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
            res.writeHead(200, {'Content-Type': 'text/html'});
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
                        res.writeHead(200, {'Content-Type': 'text/html'});
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
function handleAllAnimalPage(req, res, criteria, searchTerm) {
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
                if (searchTerm !== null) {
                    animals = await searchAnimals(searchTerm);
                } else {
                    animals = await getAnimals(criteria);
                }
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
                        res.writeHead(200, {'Content-Type': 'text/html'});
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
                        res.writeHead(200, {'Content-Type': 'text/html'});
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
                    res.writeHead(200, {'Content-Type': 'text/html'});
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
                    res.writeHead(200, {'Content-Type': 'text/html'});
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
                    res.writeHead(200, {'Content-Type': 'text/html'});
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
                    res.writeHead(200, {'Content-Type': 'text/html'});
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
                    res.writeHead(200, {'Content-Type': 'text/html'});
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
            res.writeHead(200, {'Content-Type': contentType});
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
            res.writeHead(200, {'Content-Type': 'text/html'});
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
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(modContent, 'utf-8');
                }
            });

        }
    });
}

// function handleSettingsPage(req, res) {
//     const filePath = '../frontend/settings.html';
//     fs.readFile(filePath, 'utf8', (err, content) => {
//       if (err) {
//         res.writeHead(500);
//         res.end('Internal server error');
//       } else {
//         const modifiedContent = includeAssets(content, filePath);
//         replaceImageUrls(modifiedContent, (imgErr, modContent) => {
//           if (imgErr) {
//             res.writeHead(500);
//             res.end('Internal server error');
//           } else {
//             // client.connect();
//             // console.log('Connected to the database');

//             // const cookieHeader = req.headers.cookie;
//             // const token = parseCookie(cookieHeader, 'token');
//             // const secretKey = 'your_secret_key_here';

//             // const decodedToken = jwt.verify(token, secretKey);
//             // if (!decodedToken) {
//             //     console.log('Invalid token');
//             //     res.writeHead(401, { 'Content-Type': 'text/html' });
//             //     res.write('<h1>Invalid token</h1>');
//             //     res.end();
//             //     return;
//             // }

//             // const userEmail = decodedToken.email;

//             // const collection = client.db(dbName).collection('users');

//             // const user = collection.findOne({ email: userEmail });

//             // if (!user) {
//             //     console.log('User not found');
//             //     res.writeHead(404, { 'Content-Type': 'text/html' });
//             //     res.write('<h1>User not found</h1>');
//             //     res.end();
//             //     return;
//             // }

//             // const mode = user.mode || false; // Get the mode setting from user or set a default value
//             renderPage(req, res, modContent, mode); // Render the page using the renderPage function
//           }
//         });
//       }
//     });
//   }
async function handleSettingsPageInfo(req, res) {

    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.slice(14);
        if (!verifyToken(token)) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({error: 'Unauthorized'}));
            return;
        } else {
            const dec = verifyToken(token);
            const userId = dec.id;
            const user = await getUserFromDatabase(userId);

            if (user) {
                const response = {
                    name: user.name,
                    email: user.email,
                };
                const jsonResponse = JSON.stringify(response);
                res.setHeader('Content-Type', 'application/json');
                res.end(jsonResponse);
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({error: 'User not found'}));
            }
        }
    }
}


/*async function handleAdminPage(req, res) {
    const filePath = '../frontend/admin2.html';
  
    fs.readFile(filePath, 'utf8', async (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Internal server error');
      } else {
        try {
          const users = await getAllUsersFromDatabase();
  
          const usersTable = generateUsersTable(users);
  
          let modifiedContent = content.replace('<div id="users-table"></div>', usersTable);
  
          modifiedContent = includeAssets(modifiedContent, filePath);
          replaceImageUrls(modifiedContent, (imgErr, modContent) => {
            if (imgErr) {
              res.writeHead(500);
              res.end('Internal server error');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(modContent, 'utf-8');
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

  async function handleAdminPage(req, res) {
    const filePath = '../frontend/admin2.html';
  
    fs.readFile(filePath, 'utf8', async (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Internal server error');
      } else {
        try {
          const users = await getAllUsersFromDatabase();
          const animals = await getAllAnimalsFromDatabase();
          const reservations = await getAllReservationsFromDatabase();
  
          const usersTable = generateUsersTable(users);
          const animalsTable = await generateAnimalsTable(animals);
          const reservationsTable = generateReservationsTable(reservations);
  
          const numUsers = users.length;
          const numAnimals = animals.length;
          const numReservations = reservations.length;
  
          let modifiedContent = content.replace('<div id="users-table"></div>', usersTable);
          modifiedContent = modifiedContent.replace('<div id="animals-table"></div>', animalsTable);
          modifiedContent = modifiedContent.replace('<div id="reservations-table"></div>', reservationsTable);
          modifiedContent = modifiedContent.replace('numUsers', numUsers);
          modifiedContent = modifiedContent.replace('numAnimals', numAnimals);
          modifiedContent = modifiedContent.replace('numReservations', numReservations);
  
          modifiedContent = includeAssets(modifiedContent, filePath);
          replaceImageUrls(modifiedContent, (imgErr, modContent) => {
            if (imgErr) {
              res.writeHead(500);
              res.end('Internal server error');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(modContent, 'utf-8');
            }
          });

          //deleteButtonListeners();
        } catch (error) {
          console.log(error);
          res.writeHead(500);
          res.end('Internal server error');
        }
      }
    });
  }
  
  
  async function handleDataRequest(req, res) {
    try {
      const users = await getAllUsersFromDatabase();
      const animals = await getAllAnimalsFromDatabase();
      const reservations = await getAllReservationsFromDatabase();
  
      const usersTable = generateUsersTable(users);
      const animalsTable = generateAnimalsTable(animals);
      const reservationsTable = generateReservationsTable(reservations);
  
      const responseData = {
        usersTable,
        animalsTable,
        reservationsTable
      };
  
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(responseData));
    } catch (error) {
      console.error('Error handling data request:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }

  function extractUserIdFromUrl(url) {
    const userIdRegex = /\/delete-user\/(\w+)/;
    const match = url.match(userIdRegex);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  }

  function extractAnimalIdFromUrl(url) {
    const userIdRegex = /\/delete-animal\/(\w+)/;
    const match = url.match(userIdRegex);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  }

  function extractReservationIdFromUrl(url) {
    const userIdRegex = /\/delete-reservation\/(\w+)/;
    const match = url.match(userIdRegex);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  }
  
  
  
  
  
  async function handleAddLike(req, res) {
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
            const user = await getUserFromDatabase(userId);
            const animalId = req.url.split('/')[2];
        
                if (user) {
                        const updatedAnimal = await updateAnimalLikes(userId,animalId, 1);
                        if (updatedAnimal) {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({message: 'Animal updated successfully'}));
                        } else {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({error: 'Internal server error'}));
                        }
                    }
                 else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({error: 'User not found'}));
                }
            
        }
    }

  }

  async function handleRemoveLike(req, res) {
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
            const user = await getUserFromDatabase(userId);
            const animalId = req.url.split('/')[2];
        
                if (user) {
                        const updatedAnimal = await updateAnimalLikes(userId,animalId, 0);
                        if (updatedAnimal) {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({message: 'Animal updated successfully'}));
                        } else {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({error: 'Internal server error'}));
                        }
                    }
                 else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({error: 'User not found'}));
                }
            
        }
    }

  }


async function handleNameUpdate(req, res) {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.slice(14);
        if (!verifyToken(token)) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({error: 'Unauthorized'}));
            return;
        } else {
            const tok = verifyToken(token);
            const id = tok.id;
            let body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const data = JSON.parse(body);

                const newName = data.name;
                updateName(id, newName, req, res);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({message: 'Name updated successfully'}));
            });
        }
    }

}

async function handlePasswordUpdate(req, res) {

    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.slice(14);
        if (!verifyToken(token)) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({error: 'Unauthorized'}));
            return;
        } else {
            const tok = verifyToken(token);
            const id = tok.id;
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const data = JSON.parse(body);

                const newPassword = data.password;
                updatePassword(id, newPassword, req, res);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({message: 'Password updated successfully'}));
            });
        }

    }
}


async function handleEmailUpdate(req, res) {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.slice(14);
    if (!verifyToken(token)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({error: 'Unauthorized'}));
        return;
    } else {
        const tok = verifyToken(token);
        const id = tok.id;
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const data = JSON.parse(body);

            const newEmail = data.email;
            const rez = await updateEmail(id, newEmail, req, res);

            if (rez.success) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({message: 'Email updated successfully'}));
            } else {

                if (rez.message === 'Email already exists') {
                    res.statusCode = 409;
                    res.end(JSON.stringify({error: 'Email already exists'}));
                } else {
                    console.log('mare eroare');
                    res.statusCode = 500;
                    res.end(JSON.stringify({error: 'Error at updating'}));
                }
            }
        });
    }
}



//for the contact us page
function handleContactUs(req, res) {
    const filePath = '../frontend/contact-us.html';

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
                    res.writeHead(200, {'Content-Type': 'text/html'});
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


module.exports = {
    handleLandingPage,
    handleLoginPage,
    handleHomePage,
    handleGeneralAnimalPage,
    handleAllAnimalPage,
    handleZooPlanPage,
    handleAboutUsPage,
    handleSettingsPage,
    handleRegisterPage,
    handleHelpPage,
    handleForgotPasswordPage,
    handleProgramPage,
    handleOneAnimalPage,
    handleAdminPage,
    handleStaticFile,
    handleDataRequest,
    extractUserIdFromUrl,
    extractAnimalIdFromUrl,
    extractReservationIdFromUrl,
    handleSettingsPageInfo,
    handleEmailUpdate,
    handleNameUpdate,
    handlePasswordUpdate,
    handleAddLike,
    handleRemoveLike,
    handleStaticFile,
    handleContactUs
};
