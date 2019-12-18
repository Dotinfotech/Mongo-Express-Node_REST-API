// TODO: Create CRUD API & LOGIN, REGISTER API

import userModel from '../models/User';

async function createUser(req, res) {
    try {
        const { username, phone } = req.body;
        !username && res.send('Enter Username');
        !phone && res.send('Enter Phone');

        const User = await userModel
            .create({ username, phone })
            .then(() => {
                res.send('User created successfully');
            })
            .catch(err => {
                res.send(err);
            });
        return User;
    } catch (err) {
        res.send(err);
    }
}

// TODO: Update API with search Username query
async function searchUsers(req, res) {
    try {
        const { query } = req.query;
    } catch (err) {
        res.error(err);
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        !id && res.send('Enter ID');
        userModel
            .findByIdAndRemove({ _id: id })
            .then(() => res.send('User deleted successfully'));
    } catch (err) {
        res.error(err);
    }
}

export default { createUser, searchUsers, deleteUser };
