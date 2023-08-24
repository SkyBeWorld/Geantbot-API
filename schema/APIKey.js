const { model, Schema } = require('mongoose')

module.exports = model("userAPISchema", new Schema({
    username: {
        type: String,
        required: true
    },
    UserID: {
        type: Number,
        required: true
    },
    APIKey: {
        type: String,
        required: false
    }
}))