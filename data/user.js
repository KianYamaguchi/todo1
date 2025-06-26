const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLoalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
email:{
    type: String,
    required: true,
    unique: true
    }
});

userSchema.plugin(passportLoalMongoose);

module.exports = mongoose.model('User', userSchema);