import userModel from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cryptoRandomString from 'crypto-random-string';
import sgMail from '@sendgrid/mail';

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username) throw new Error('Enter Username!');
        if (!email) throw new Error('Enter Email!');
        if (!password) throw new Error('Enter Password!');

        const checkEmail = await userModel.findOne(
            { email },
            { _id: 0, email: 1 }
        );

        if (checkEmail && checkEmail.email) {
            throw new Error('Email already in use');
        }

        const checkUsername = await userModel.findOne(
            { username },
            { _id: 0, username: 1 }
        );

        if (checkUsername && checkUsername.username) {
            throw new Error('Username already in use');
        }

        if (!checkEmail && !checkUsername) {
            const saltRounds = 10;
            const hashPassword = bcrypt.hashSync(password, saltRounds);
            const createUser = await userModel.create({
                username,
                email,
                password: hashPassword,
            });
            createUser && res.send('User Created Successfully');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const updateUser = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            res.send('Enter Username');
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
        const { email, password } = req.body;
        if (!email) throw new Error('Enter Email!');
        if (!password) throw new Error('Enter Password!');

        const checkEmail = await userModel.findOne(
            { email },
            { _id: 0, email: 1, password: 1, username: 1 }
        );
        if (!checkEmail) throw new Error('Can not find user with this email');

        const { username } = checkEmail;

        if (checkEmail && checkEmail.email) {
            const checkPassword = await bcrypt.compare(
                password,
                checkEmail.password
            );

            if (!checkPassword) {
                throw new Error('Password is wrong, Please check again');
            } else if (checkPassword) {
                const secretKey = process.env.SECRETKEY || 'mysecretkey';
                const token = await jwt.sign({ username }, secretKey, {
                    expiresIn: '1h',
                });
                res.send({ message: 'User LoggedIn Sucessfully', token });
            }
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, newpassword } = req.body;
        if(!password || !newpassword){throw new Error("enter password")}
        if (password === newpassword) {
            throw new Error("new password can't be your old password");
        }
        
        const auth = req.headers.authorization;
        const authToken =
            auth && auth.startsWith('Bearer ')
                ? auth.slice(7, auth.length)
                : null;

        console.log('auth', authToken);
        const search = await userModel.findById({ _id: id });
        console.log(search)
        const confirmPass = await bcrypt.compare(password, search.password);

        const verifyToken = jwt.verify(authToken, process.env.SECRETKEY || 'mysecretkey')
        if(!verifyToken){
            throw new Error ("login required") 
        }
        if (!confirmPass) {
            throw new Error("password doesn't match");
        } else {
            const saltRounds = 10;
            const newHash = bcrypt.hashSync(newpassword, saltRounds);
            const insert = await userModel.update(
                { _id: id },
                { $set: { password: newHash } }
            );
            insert && res.send('password changed');
        }
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
        console.log('error', res.send(err));
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.send('enter email-id to search');
            return;
        }

        const token = cryptoRandomString({
            length: 20,
            type: 'url-safe',
        });

        const date = new Date();
        const expTime = date.getTime() + 60000;

        const search = await userModel.findOneAndUpdate(
            { email: email },
            { $set: { token, expTime } }
        );
        if (!search) throw new Error('Can not find user');
        else {
            sgMail.setApiKey(process.env.KEY);
            //   const sendMail = {
            //     to: search.email,
            //      from: process.env.verificationId,
            //      subject: 'reset password',
            //    html: `click here to reset password :
            //  http://localhost:8080/api/users/resetPassword?token=${token}
            //   Link will expire in 10 min
            // //   `,
            //  };
            // sgMail.send(sendMail);
            res.send('check your mailid for link');
        }
    } catch (err) {
        res.send(err.message);
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.query;
        const { newPassword } = req.body;

        if (!token) throw new Error('Add Token');
        if (!newPassword) throw new Error('Add New Password');

        const saltRounds = 10;
        const hashed = bcrypt.hashSync(newPassword, saltRounds);

        // const currentTime = new Date().getTime();

        const checkToken = await userModel.findOneAndUpdate(
            { token },
            { $set: { password: hashed } },
            { _id: 1, email: 1, password: 1, username: 1, token: 1, expTime: 1 }
        );
        if (!checkToken) throw new Error('Can not find user or Link Expired');

        // TODO: Check condition for token EXP time & Remove Token, EXP time
        if (checkToken) {
            res.send('Password Updated Successfully');
        }
    } catch (err) {
        res.send(err.message);
    }
};

// TODO: Naresh Make API for
// 1. Forgot-Password(Email)
// 2. Reset-Password(New/Confirm-Password),
// 3. Change Password(Old, New/Confirm Password) done
// Use sendGrid for sending mail, crypto-random-string for generating token

export default {
    registerUser,
    searchUsers,
    deleteUser,
    updateUser,
    login,
    changePassword,
    forgotPassword,
    resetPassword,
};
