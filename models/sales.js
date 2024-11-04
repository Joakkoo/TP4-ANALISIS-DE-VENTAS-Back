const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
    productos: [{
        nombre: { type: String, required: true },
        cantidad: { type: Number, required: true },
        total: Number
    }],
    fecha: { type: Date, required: true },
    pdfId: { type: mongoose.Schema.Types.ObjectId, ref: 'PDF', required: true } // Relación con el PDF procesado
});

module.exports = mongoose.model('Venta', ventaSchema);
