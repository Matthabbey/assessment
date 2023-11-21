const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const streamData = new mongoose.Schema({
    MSISDN:{
        type:String
    },
    quantity:{
        type:String
    },
    narration:{
        type:String
    },
},
{
timestamps: true
});

const streamDataEntry = mongoose.model('streamData', streamData);
module.exports = streamDataEntry;
