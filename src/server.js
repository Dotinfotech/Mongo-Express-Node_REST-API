const express = require('express');
const urlencoded = require('body-parser').urlencoded;
const json = require('body-parser').json;
const cors = require('cors');
require('dotenv').config();

const server = express();

// Env Variables
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
// const CONNECTION_URL = process.env.CONNECTION_URL;
// const DATABASE_NAME = process.env.DATABASE_NAME;

// Database Connection
require('./config/connection');

// Parser From Req.body
server.use(urlencoded({ extended: false }));
server.use(json());

// Enable the CORS
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Methods',
        'GET, PUT, POST, DELETE, OPTIONS'
    );
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});
server.use(cors());

//Routes
var usersRouter = require('./routes/User');

// Server Route
server.use('/api/users', usersRouter);

// Server Start
server.listen(PORT, () => {
    console.log(`API Running at http://${HOST}:${PORT}/api`);
});
