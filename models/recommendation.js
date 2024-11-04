const mongoose = require('mongoose');

const recomendacionSchema = new mongoose.Schema({
    pdfId: { type: mongoose.Schema.Types.ObjectId, ref: 'PDF', required: true },
    recomendaciones: String,
    fechaGeneracion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recomendacion', recomendacionSchema);
