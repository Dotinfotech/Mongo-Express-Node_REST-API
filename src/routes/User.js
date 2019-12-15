const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.json({ message: 'Welcome to RESTFul API' });
    next();
});

// TODO: Add POST, PUT, DELETE, GET Routing
// Router.get/post/put/delete

module.exports = router;
