import mongoose from 'mongoose';

// TODO: Add User Schema
const schema = new mongoose.Schema({
    username: { type: String, required: true, max: 100 },
    phone: { type: Number, required: true },
});

const User = new mongoose.model('User', schema);

export default User;