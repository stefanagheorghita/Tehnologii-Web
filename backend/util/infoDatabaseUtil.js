const { getClient } = require('./db');
const { ObjectId } = require('mongodb');

const mongoose = require('mongoose');

const dbName = 'web_db';

async function getDietByIdFromDatabase(id) {
    const client = getClient();
    try {
        const db = client.db(dbName);
        const dietCollection = db.collection('diet');
        const diet = await dietCollection.findOne({ _id: new ObjectId(id) });
        return diet.name;
    } catch (error) {
        console.error('Error retrieving diet by ID:', error);
        throw error;
    }
}

async function getStatusByIdFromDatabase(id) {
    const client = getClient();
    try {
        const db = client.db(dbName);
        const statusCollection = db.collection('status');
        const status = await statusCollection.findOne({ _id: new ObjectId(id) });
        return status.name;
    } catch (error) {
        console.error('Error retrieving status by ID:', error);
        throw error;
    }
}

async function getClimaByIdFromDatabase(id) {
    const client = getClient();
    try {
        const db = client.db(dbName);
        const climaCollection = db.collection('clima');
        const clima = await climaCollection.findOne({ _id: new ObjectId(id) });
        return clima.name;
    } catch (error) {
        console.error('Error retrieving clima by ID:', error);
        throw error;
    }
}

async function getReproductionByIdFromDatabase(id) {
    const client = getClient();
    try {
        const db = client.db(dbName);
        const reproductionCollection = db.collection('reproduction');
        const reproduction = await reproductionCollection.findOne({ _id: new ObjectId(id) });
        return reproduction.name;
    } catch (error) {
        console.error('Error retrieving reproduction by ID:', error);
        throw error;
    }
}

async function getTypeByIdFromDatabase(id) {
    const client = getClient();
    try {
        const db = client.db(dbName);
        const typeCollection = db.collection('type');
        const type = await typeCollection.findOne({ _id: new ObjectId(id) });
        return type.name;
    } catch (error) {
        console.error('Error retrieving type by ID:', error);
        throw error;
    }
}

async function getCoveringByIdFromDatabase(id) {
    const client = getClient();
    try {
       
        const db = client.db(dbName);
        const coveringCollection = db.collection('covering');
        const covering = await coveringCollection.findOne({ _id: new ObjectId(id) });
        return covering.name;
    } catch (error) {
        console.error('Error retrieving covering by ID:', error);
        throw error;
    }
}

async function getDangerByIdFromDatabase(id) {
  const client = getClient();
  try {
    await client.connect();

    const db = client.db(dbName);
    const dangerousnessCollection = db.collection('dangerousness');
    const dangerousness = await dangerousnessCollection.findOne({ _id: new ObjectId(id) });
    return dangerousness.name;
  } catch (error) {
    console.error('Error retrieving dangerousness by ID:', error);
    throw error;
  }
}

//////for users
async function getUserFromDatabase(id){
    const client=getClient();
    try{
     
        const db=client.db(dbName);
        const userCollection=db.collection('users');
        const user=await userCollection.findOne({ _id: new ObjectId(id) });
        //console.log(user);
        return user;
    } catch (error) {
        console.error('Error retrieving dangerousness by ID:', error);
        throw error;
    }
    
}

async function getAllUsersFromDatabase() {
  const client = getClient();
  try {
    await client.connect();

    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    const users = await usersCollection.find().toArray();
    return users;
  } catch (error) {
    console.error('Error retrieving users from the database:', error);
    throw error;
  }
}

async function getAllAnimalsFromDatabase() {
  const client = getClient();
  try {
    await client.connect();

    const db = client.db(dbName);
    const animalsCollection = db.collection('animals');
    const animals = await animalsCollection.find().toArray();
    return animals;
  } catch (error) {
    console.error('Error retrieving animals from the database:', error);
    throw error;
  }
}

async function getAllReservationsFromDatabase() {
  const client = getClient();
  try {
    await client.connect();

    const db = client.db(dbName);
    const reservationsCollection = db.collection('reservations');
    const reservations = await reservationsCollection.find().toArray();
    return reservations;
  } catch (error) {
    console.error('Error retrieving animals from the database:', error);
    throw error;
  }
}


/*function generateUsersTable(users) {
  let tableHTML = '<table>';
  tableHTML += '<tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Email</th></tr>';
 
  users.forEach((user, index) => {
      const rowClass = index % 2 === 0 ? 'table-row-white' : 'table-row-grey';

      tableHTML += `<tr class="${rowClass}">
      <td>${user._id}</td>
      <td>${user.first_name}</td>
      <td>${user.last_name}</td>
      <td>${user.email}</td>
      <td><button class="delete-user-button" onclick="deleteUser('${user._id}')">Delete</button></td>
    </tr>`;
  });
 
  tableHTML += '</table>';
  return tableHTML;
}*/

function generateUsersTable(users) {
  let tableHTML = '<div class="table-container">';
  tableHTML += '<table>';
  tableHTML += '<tr class="table-header"><th>ID</th><th>Username</th><th>Email</th><th class="delete-column"></th></tr>';

  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    const rowClass = index % 2 === 0 ? 'table-row-white' : 'table-row-grey';

    tableHTML += `<tr class="${rowClass}">
        <td>${user._id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td><button class="delete-user-button delete-button" onclick="deleteUser('${user._id}')">Delete</button></td>
      </tr>`;
  }

  tableHTML += '</table>';
  tableHTML += '</div>';
  return tableHTML;
}

/*function generateAnimalsTable(animals) {
  let tableHTML = '<div class="table-container">';
  tableHTML += '<table>';
  tableHTML += '<tr><th>Name</th><th>Status</th><th>Diet</th><th>Clima</th><th>Type</th></tr>';

  for (let index = 0; index < animals.length; index++) {
    const animal = animals[index];
    const rowClass = index % 2 === 0 ? 'table-row-white' : 'table-row-grey';

    tableHTML += `<tr class="${rowClass}">
      <td>${animal.name}</td>
      <td>${getStatusByIdFromDatabase(animal.status_id)}</td>
      <td>${getDietByIdFromDatabase(animal.diet_id)}</td>
      <td>${getClimaByIdFromDatabase(animal.clima_id)}</td>
      <td>${getTypeByIdFromDatabase(animal.type_id)}</td>
      <td><button class="delete-animal-button delete-button" onclick="deleteAnimal('${animal._id}')">Delete</button></td>
      </tr>`;
  };

  tableHTML += '</table>';
  tableHTML += '</div>';
  return tableHTML;
}*/

async function generateAnimalsTable(animals) {
  let tableHTML = '<div class="table-container">';
  tableHTML += '<table>';
  tableHTML += '<tr><th>Name</th><th>Type</th><th>Diet</th><th>Clima</th><th>Status</th><th class="delete-column"></th></tr>';

  const promises = animals.map(async (animal, index) => {
    const rowClass = index % 2 === 0 ? 'table-row-white' : 'table-row-grey';

    const statusPromise = getStatusByIdFromDatabase(animal.status_id);
    const dietPromise = getDietByIdFromDatabase(animal.diet_id);
    const climaPromise = getClimaByIdFromDatabase(animal.clima_id);
    const typePromise = getTypeByIdFromDatabase(animal.type_id);

    const [type, diet, clima, status] = await Promise.all([
      statusPromise,
      dietPromise,
      climaPromise,
      typePromise
    ]);

    tableHTML += `<tr class="${rowClass}">
      <td>${animal.name}</td>
      <td>${type}</td>
      <td>${diet}</td>
      <td>${clima}</td>
      <td>${status}</td>
      <td><button class="delete-animal-button delete-button" onclick="deleteAnimal('${animal._id}')">Delete</button></td>
      </tr>`;
  });

  await Promise.all(promises);

  tableHTML += '</table>';
  tableHTML += '</div>';
  return tableHTML;
}



function generateReservationsTable(reservations) {
  let tableHTML = '<div class="table-container">';
  tableHTML += '<table>';
  tableHTML += '<tr><th>Name</th><th>Email</th><th>Date</th><th>Number of tickets</th><th>Message</th><th class="delete-column"></th></tr>';

  for (let index = 0; index < reservations.length; index++) {
    const reservation = reservations[index];
    const rowClass = index % 2 === 0 ? 'table-row-white' : 'table-row-grey';

    tableHTML += `<tr class="${rowClass}">
        <td>${reservation.name}</td>
        <td>${reservation.email}</td>
        <td>${reservation.date}</td>
        <td>${reservation.number_tickets}</td>
        <td>${reservation.message}</td>
        <td><button class="delete-reservation-button delete-button" onclick="deleteReservation('${reservation._id}')">Delete</button></td>
        </tr>`;
  }

  tableHTML += '</table>';
  tableHTML += '</div>';
  return tableHTML;
}



/*function generateAnimalsTable(animals) {
  let tableHTML = '<table>';
  tableHTML += '<tr><th>ID</th><th>Name</th><th>Type</th><th>Age</th></tr>';
 
  animals.forEach((animal) => {
    const rowClass = index % 2 === 0 ? 'table-row-white' : 'table-row-grey';

    tableHTML += `<tr class="${rowClass}">
    <td>${animal._id}</td>
    <td>${animal.name}</td>
    <td>${animal.type}
    <td><button class="delete-animal-button" onclick="deleteAnimal('${animal._id}')">Delete</button></td>
    </tr>`;
  });
 
  tableHTML += '</table>';
  return tableHTML;
}

function generateReservationsTable(reservations) {
  let tableHTML = '<table>';
  tableHTML += '<tr><th>ID</th><th>Name</th><th>Type</th><th>Age</th></tr>';
 
  reservations.forEach((reservation) => {
    const rowClass = index % 2 === 0 ? 'table-row-white' : 'table-row-grey';

    tableHTML += `<tr class="${rowClass}">
    <td>${reservation._id}</td>
    <td>${reservation.name}</td>
    <td>${reservation.date}</td>
    <td><button class="delete-reservation-button" onclick="deleteReservation('${reservation._id}')">Delete</button></td>
    </tr>`;
  });
 
  tableHTML += '</table>';
  return tableHTML;
}*/

async function deleteUserFromDatabase(userId) {
  const client = getClient();
  try {
    await client.connect();

    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    const deleteResult = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

    if (deleteResult.deletedCount === 1) {
      console.log('User deleted successfully');
      return true;
    } else {
      console.log('User not found');
      return false;
    }
  } catch (error) {
    console.error('Error deleting user from the database:', error);
    throw error;
  } finally {
    client.close();
  }
}

async function deleteAnimalFromDatabase(animalId) {
  const client = getClient();
  try {
    await client.connect();

    const db = client.db(dbName);
    const animalsCollection = db.collection('animals');
    const deleteResult = await animalsCollection.deleteOne({ _id: new ObjectId(animalId) });

    if (deleteResult.deletedCount === 1) {
      console.log('Animal deleted successfully');
      return true;
    } else {
      console.log('Animal not found');
      return false;
    }
  } catch (error) {
    console.error('Error deleting animal from the database:', error);
    throw error;
  } finally {
    client.close();
  }
}

async function deleteReservationFromDatabase(reservationId) {
  const client = getClient();
  try {
    await client.connect();

    const db = client.db(dbName);
    const reservationCollection = db.collection('reservations');
    const deleteResult = await reservationCollection.deleteOne({ _id: new ObjectId(reservationId) });

    if (deleteResult.deletedCount === 1) {
      console.log('Reservation deleted successfully');
      return true;
    } else {
      console.log('Reservation not found');
      return false;
    }
  } catch (error) {
    console.error('Error deleting reservation from the database:', error);
    throw error;
  } finally {
    client.close();
  }
}

async function insertAnimal(animalData) {
  const animal = parseFormData(animalData);
  const client = getClient();
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('animals');
    await collection.insertOne(animal);
  } catch (error) {
    console.error('Error inserting animals:', error);
    throw error;
  } finally {
    client.close();
  }
}

function parseFormData(formData) {
  const boundary = formData.substring(0, formData.indexOf('\r\n'));
  const parts = formData.split(boundary).filter(part => part.trim().length > 0);

  const animal = {};

  for (const part of parts) {
    if (part.includes('Content-Disposition: form-data;')) {
      const nameMatch = /name="([^"]+)"/.exec(part);
      const valueMatch = /\r\n\r\n([\s\S]*)\r\n/.exec(part);

      if (nameMatch && valueMatch) {
        const name = nameMatch[1];
        const value = valueMatch[1];

        if (name === 'file') {
          const fileData = JSON.parse(value);
          const transformedData = transformObjectIDs(fileData);
          Object.assign(animal, transformedData);
        }
      }
    }
  }

  return animal;
}

function transformObjectIDs(data) {
  const transformedData = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];
  
    if (typeof value === 'object' && value.hasOwnProperty('$oid')) {
      const objectId = new mongoose.Types.ObjectId(value.$oid);
      transformedData[key] = objectId;
    } else {
      transformedData[key] = value;
    }
  });

  return transformedData;
}


module.exports = {
  getDietByIdFromDatabase,
  getStatusByIdFromDatabase,
  getClimaByIdFromDatabase,
  getReproductionByIdFromDatabase,
  getTypeByIdFromDatabase,
  getCoveringByIdFromDatabase,
  getDangerByIdFromDatabase,
  getUserFromDatabase,
  getAllUsersFromDatabase,
  getAllAnimalsFromDatabase,
  generateUsersTable,
  getAllReservationsFromDatabase,
  generateAnimalsTable,
  generateReservationsTable,
  deleteUserFromDatabase,
  deleteAnimalFromDatabase,
  deleteReservationFromDatabase,
  insertAnimal
  //deleteButtonListeners
};
