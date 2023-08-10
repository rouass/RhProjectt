const mongoose = require('mongoose');

var congeSchema = new mongoose.Schema({
    
    type: {
        type: String,
        required: true
    },
    dateD: {
        type: Date,
        required: true
    },
    dateF: {
        type: Date,
        required: true
    },
    cause: {
        type: String,
        required: true
    },
    status:{
        type:String,
        default: 'pending'
    },
    userId:{
        type:String,
        required: true
    },
    responseText: {
        type: String,
        default: '', 
      },
});
const congeModel = mongoose.model("conges", congeSchema);

module.exports = congeModel;