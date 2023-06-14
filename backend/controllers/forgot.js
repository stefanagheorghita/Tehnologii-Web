const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Create a nodemailer transporter with your email service provider configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zoowebmanager@gmail.com',
    pass: 'zoowebmanager',
  },
});

async function handleForgotPasswordRequest(req, res) {
  // Get the email address from the form data
  const email = req.body.email;

  // Compose the email message
  const mailOptions = {
    from: 'zoowebmanager@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: 'Here is your new password: XYZ123',
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.statusCode = 200;
    res.end('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.statusCode = 500;
    res.end('Failed to send email');
  }
}

/*const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

async function handleForgotPasswordRequest(req, res) {
  let body = '';

  // Read the request body data
  req.on('data', chunk => {
    body += chunk.toString();
  });

  // Parse the request body data
  req.on('end', async () => {
    // Parse the body as URL-encoded format
    const parsedBody = new URLSearchParams(body);
    const email = parsedBody.get('email');
    const subject = 'Password Reset';
    const message = 'Here is your new password: XYZ123';

    // Compose the command to send email using the 'mail' command-line utility
    const command = `echo "${message}" | mail -s "${subject}" ${email}`;

    try {
      // Execute the command
      console.log('Command:', command);
      await exec(command);
      console.log('Email sent successfully');
      res.statusCode = 200;
      res.end('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      res.statusCode = 500;
      res.end('Failed to send email');
    }
  });
}*/


