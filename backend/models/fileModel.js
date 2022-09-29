const mongoose = require('mongoose')
const fileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fileName: {
        type: String,
        required: [true, 'Please add a name'],
    },
    title: {
        type: String,
        required: [true, 'Please add an email'],
    },
    fileUrl: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('File', fileSchema)