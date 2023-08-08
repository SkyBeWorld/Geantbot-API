const { model, Schema } = require('mongoose')

module.exports = model("newsJSON", new Schema({
    newsName: {
        type: String,
        required: true
    },
    newsDesc: {
        type: String,
        required: true
    },
    newsID: {
        type: String,
        required: true
    }
}))