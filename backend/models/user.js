const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true
    },
    password:
    {
        type: String,
        required: true
    },
    profileImageURL:
    {
        type: String,
        default: './public/images/default.png'
    },
    createdAt:
    {
        type: Date, 
        default: Date.now
    },
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password'))
    {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);