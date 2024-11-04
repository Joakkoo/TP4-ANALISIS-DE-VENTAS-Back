const mongoose = require('mongoose');
require('dotenv').config();


// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(error => console.error('Error al conectar a MongoDB:', error));

module.exports = mongoose;
