const { model, Schema } = require('mongoose');

const UserXP = new Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 1,
    }
});



  

module.exports = model("UserXP", UserXP);