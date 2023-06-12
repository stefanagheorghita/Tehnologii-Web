const querystring = require('querystring');

function handleLoginRequest(req, res) {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
        const data = JSON.parse(body);
        const email = data.email;
        const password = data.password;
      if (email === 'ana' && password === 'password') {
        console.log('yuppu yey yey');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h1>Login successful!</h1>');
        res.end();
      } else {
        console.log('bad');
        res.writeHead(401, { 'Content-Type': 'text/html' });
        res.write('<h1>Invalid credentials</h1>');
        res.end();
      }
    });
  }
}

module.exports = { handleLoginRequest };
