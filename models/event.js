const mongoose = require('mongoose');mongoose
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    _id: Object,
    activityName : String,
    amount: String,
    dateEvent: String,
    description: String,
    location : String,
    imageUrl: String
    
});

module.exports = mongoose.model( 'event', eventSchema,  'newEvent');