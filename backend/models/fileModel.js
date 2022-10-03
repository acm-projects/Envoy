const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    fileName: {
        type: String,
        required: [true, 'Please add a name'],
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    fileUrl: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('File', fileSchema);
