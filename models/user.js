const mongoose = require('mongoose'); //import mongoose
const Schema = mongoose.Schema //Schema

const userSchema = new Schema({    //blueprint
    email: String,
    password: String
})

module.exports = mongoose.model('user', userSchema, 'user') //First arg is name of model, second name of the Schema, third name of the collection in database



