const querystring = require('querystring');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/web_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const reservationSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: String,
  number_tickets: String,
  message: String
});

const Reservation = mongoose.model('Reservation', reservationSchema);

async function handleProgramRequest(req, res) {
  console.log('handleProgramRequest');
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const formData = querystring.parse(body);

      const name = formData['full-name'];
      const email = formData['email'];
      const date = formData['date'];
      const number_tickets = formData['sel'];
      const message = formData['Message'];

      try {
        await saveReservationToDatabase(name, email, date, number_tickets, message);
        res.statusCode = 200;
        res.end('Reservation saved successfully!');
      } catch (error) {
        res.statusCode = 500;
        res.end('Error saving reservation');
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
}

async function saveReservationToDatabase(name, email, date, number_tickets, message) {
    try {
      const reservation = new Reservation({
        name: name,
        email: email,
        date: date,
        number_tickets: number_tickets,
        message: message
      });
  
      await reservation.save();
      console.log('Reservation saved:', reservation);
    } catch (error) {
      console.error('Error saving reservation:', error);
      throw error;
    }
  }

module.exports = { handleProgramRequest };