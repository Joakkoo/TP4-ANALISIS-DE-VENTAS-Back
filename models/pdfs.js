const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    fechaCarga: { type: Date, default: Date.now },
    recomendaciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recomendacion' }]
});

module.exports = mongoose.model('PDF', pdfSchema);
