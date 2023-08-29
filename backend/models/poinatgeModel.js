const mongoose = require('mongoose');

var pointageSchema = new mongoose.Schema({
    type: {
        type: String, // 'start', 'clockOut', 'takeBreak'
        required: false
    },
  
    heureDP: {
        type: String,
        required: true
    },
    heureFP: {
        type: String,
        required: false,
        default: null
    },
    date:{
        type:String, 
        required:true
},
userId:{
    type:String,
    required: true
},
numFois:{
    type:Number,
    required:true
}
/*status:{
    type:Boolean,
    required:true , 
    default: false 
}*/

});
const pointageModel = mongoose.model("pointages", pointageSchema);

module.exports = pointageModel;