import userModel from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        !username && res.send('Enter Username');
        !password && res.send('Enter password');

        const saltRounds = 10;
        const hashPassword = bcrypt.hashSync(password, saltRounds);

        const register = await userModel
            .create({
                username,
                password: hashPassword,
            })
            .then(() => {
                res.send('User created successfully');
            })
            .catch(err => {
                res.send(err);
            });
        return register;
    } catch (err) {
        res.send(err);
    }
};

const updateUser = async (req, res) => {
    try {
        const { query } = req.query;
        if(!query) {
            res.send("enter username")
        }
        const { username } = req.body;

        await userModel
            .findOneAndUpdate(
                { username: query },
                { $set: { username: username } },
                { new: true }
            )
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.send(err);
            });
        return;
    } catch (err) {
        res.send(err);
    }
};

const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const searchFactor = new RegExp(query, 'gi');

        const search = await userModel
            .find(
                {
                    $or: [{ username: searchFactor }],
                },
                {
                    _id: 0,
                    username: 1,
                }
            )
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.send(err);
            });

        return search;
    } catch (err) {
        res.send(err);
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password){
            res.send("enter credentials")
        }
        const login = await userModel
            .findOne({ username })
            .then(async data => {
                const secretKey = process.env.SECRETKEY || 'mysecretkey';
                const checkPassword = await bcrypt.compare(
                    password,
                    data.password
                );
                let token;
                checkPassword &&
                    (token = await jwt.sign({ username }, secretKey, {
                        expiresIn: '1m',
                    }));
                checkPassword
                    ? res.send({ message: 'User LoggedIn Sucessfully', token })
                    : res.send('Password is wrong, Please check again');
            })
            .catch(err => {
                res.send(err);
            });
        return login;
    } catch (err) {
        res.send(err);
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        !id && res.send('enter id');
        await userModel
            .deleteOne({ _id: id })
            .then(() => {
                res.send('user deleted');
            })
            .catch(err => {
                return res.send(err);
            });
    } catch (err) {
        console.log(res.send(err));
    }
};

export default { registerUser, searchUsers, deleteUser, updateUser, login };
