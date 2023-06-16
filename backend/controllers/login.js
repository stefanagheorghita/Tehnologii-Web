
const bcrypt = require('bcrypt');
const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'web_db';
const jwt = require('jsonwebtoken');
const {getClient} = require('../util/db');

async function handleLoginRequest(req, res) {

    if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', async () => {
            const data = JSON.parse(body);
            const email = data.email;
            const password = data.password;
            const client = getClient();

            try {
                await client.connect();
                console.log('Connected to the database');
                const collection = client.db(dbName).collection('users');
                const user = await collection.findOne({email});
                
                if (user) {
                    const passwordMatch = await bcrypt.compare(password, user.password);

                    if (passwordMatch) {
                        const secretKey = 'your_secret_key_here';
                        const token = jwt.sign({ email: user.email }, secretKey); 
                        //const mode = user.mode;////
                        //localStorage.setItem('mode', mode);////

                        console.log('Login successful');
                        res.writeHead(200, {
                            'Content-Type': 'text/html',
                            'Set-Cookie': `token=${token}; HttpOnly`,
                          });
                        // res.write('<h1>Login successful!</h1>');
                        // res.end();
                        res.write(JSON.stringify({ mode: user.mode })); // Send the mode field as a response ////
                        res.end(); ///
                    } else {
                        console.log('Invalid credentials');
                        res.writeHead(401, {'Content-Type': 'text/html'});
                        res.write('<h1>Invalid credentials</h1>');
                        res.end();
                    }
                } else {
                    console.log('Invalid credentials');
                    res.writeHead(401, {'Content-Type': 'text/html'});
                    res.write('<h1>Invalid credentials</h1>');
                    res.end();
                }
            } catch (error) {
                console.error('Error connecting to the database:', error);
                res.writeHead(500, {'Content-Type': 'text/html'});
                res.write('<h1>Internal Server Error</h1>');
                res.end();
            } finally {
                await client.close();
            }
        });
    }
}

module.exports = {handleLoginRequest};
