const querystring = require('querystring');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

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
        // Save the form data to the database
        await saveReservationToDatabase(name, email, date, number_tickets, message);

        // Send email to the user
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'zoowebmanager@gmail.com',
            pass: 'jxjlmujxakkfgsmn'
          }
        });

        const mailOptions = {
          from: 'zoowebmanager@gmail.com',
          to: email,
          subject: 'Reservation Confirmation',
          text: `Hi ${name}!\n\nYour reservation has been made successfully. We are waiting for you on ${date}!\n\nHave a nice day,\nZooWebManager team`
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Form submitted successfully</h1>');
      } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Internal Server Error</h1>');
        console.error('Error saving form data:', error);
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