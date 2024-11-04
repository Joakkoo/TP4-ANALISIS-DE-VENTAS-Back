const express = require('express');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const mongoose = require('./config/db');
const salesRoutes = require('./routes/salesRoutes');
const PORT = process.env.PORT;

dotenv.config();
const app = express();

// Configuraciones y middlewares
app.use(express.json());
app.use(fileUpload());

app.use('/api/sales', salesRoutes);

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
