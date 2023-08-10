const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String, // Corrected 'string' to 'String'
    required: true,
  },
  password: {
    type: String, // Corrected 'string' to 'String'
    required: true,
  },
  isAdmin:{
    type:Boolean ,
    default: false 
  },
  notification:{
    type:Array,
  },
  /*dateD:{
    type:Date ,
    required:true,
  },
  dateF:{
    type:Date ,
    required:true,
  },*/

});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
