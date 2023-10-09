const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String, 
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin:{
    type:Boolean ,
    default: false 
  },
  notification:{
    type:Array,
  },
 
  isActive: {
    type: Boolean,
    default: false, 
  },
  tel: {
    type: String,
    required: true, 
  },
  dateD: {
    type: Date,
    required: true,  
  },
 /*  file:{String} ,
  image:{String}, 
  dateF:{
    type:Date ,
    required:true,
  },*/

});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
