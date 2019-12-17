import express from 'express';

import userController from '../controllers/User';

export default express
    .Router()
    .post('/createUser', userController.createUser)
    .put('/updateUsers', userController.updateUser)
    .get('/findAllUsers', userController.searchUsers)
    .post('/login', userController.login)
    .post('/deleteUser/:id', userController.deleteUser);
