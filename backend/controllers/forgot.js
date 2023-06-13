const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/forgot') {
        const htmlFilePath = path.join(__dirname, '..', 'frontend', 'user-account', 'forgot.html');

        fs.readFile(htmlFilePath, 'utf8', (err, content) => {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end('Internal Server Error');
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(content);
            }
        });
    } else if (req.method === 'POST' && req.url === '/send-email') {
        // Handle the email sending logic
        // ... (code for sending email)
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});