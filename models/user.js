const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pdfs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PDF' }]
});

module.exports = mongoose.model('User', userSchema);
