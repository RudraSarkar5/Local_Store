const mongoose = require('mongoose');

const unreadSchema = mongoose.Schema({
    user :{
        type : String,
    },
    friend :{
        type : String,
    },
    friendDetails : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    msg : {
        type : String,
    },
    read : {
        type : Boolean,
    },
    lastMessageTimestamp: {
        type: Date, 
        default: Date.now, 
      },

})

const MsgNumber = mongoose.model('MsgNumber',unreadSchema);
module.exports = MsgNumber;