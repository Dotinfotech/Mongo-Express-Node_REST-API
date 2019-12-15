// TODO: Create CRUD API & LOGIN, REGISTER API

import userModel from '../models/User';

async function createUser(req, res) {
    try {
        const { username, phone } = req.body;
        !username && res.send('Enter Username');
        !phone && res.send('Enter Phone');

        userModel.create({ username, phone }, err => {
            if (err) {
                res.json({ Error: err });
                console.log('Error', Error);
            }
            res.json({
                message: 'User created successfully',
            });
        });
    } catch (err) {
        res.send(err);
    }
}

// TODO: Update API with search Username query
async function searchUsers(req, res) {
    try {
        const { username, phone } = req.body;
        !username && res.send('Enter Username');
        !phone && res.send('Enter Phone');
    } catch (err) {
        res.error(err);
    }
}

// TODO: Add Delete User API with id passed as params
async function deleteUser(req, res) {
    try {
        const { username, phone } = req.body;
        !username && res.send('Enter Username');
        !phone && res.send('Enter Phone');
    } catch (err) {
        res.error(err);
    }
}

export default { createUser, searchUsers, deleteUser };
