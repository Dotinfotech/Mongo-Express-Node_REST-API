import express from 'express';

import userController from '../controllers/User';

export default express
    .Router()
    .post('/createUser', userController.createUser)
    .get('/findAllUsers', userController.searchUsers)
    .post('/deleteUser/:id', userController.deleteUser);
