const mongoose = require('mongoose')
const fileSchema = mongoose.Schema({
    fileName: {
        type: String,
        required: [true, 'Please add a name'],
    },
    title: {
        type: String,
        required: [true, 'Please add an email'],
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('File', fileSchema)