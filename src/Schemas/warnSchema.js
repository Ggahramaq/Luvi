const {model, Schema} = require('mongoose');

let wanrningSchema = new Schema({
    GuildID: String,
    UserID: String,
    UserTag: String,
    Content: Array
});

module.exports = model("Warn", wanrningSchema)