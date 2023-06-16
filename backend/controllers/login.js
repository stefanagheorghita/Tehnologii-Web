
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
            
                console.log('Connected to the database');
                const collection = client.db(dbName).collection('users');
                const user = await collection.findOne({email});
                console.log('l-am gasit pe user'+user.mode);
                if (user) {
                    const passwordMatch = await bcrypt.compare(password, user.password);

                    if (passwordMatch) {
                        const secretKey = 'your_secret_key_here';
                        const token = jwt.sign({ email: user.email, id: user._id}, secretKey);
                        // const mode = user.mode;
                        //localStorage.setItem('mode', mode);

                        console.log('Login successful');
                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          });
                        // res.write('<h1>Login successful!</h1>');
                        // res.end();
                        console.log('cu asta m-am logat'+user.mode);
                        res.write(JSON.stringify({ mode: user.mode })); 

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
              

            }
        });
    }
}

module.exports = {handleLoginRequest};
