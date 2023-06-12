const http = require('http');
const router = require('./router');
//const login = require('./login'); 
const server = http.createServer(router);
//router.addHandler('/login', login.handleLoginRequest);
const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
