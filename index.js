const express = require('express');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const mongoose = require('./config/db');
const salesRoutes = require('./routes/salesRoutes');
const authRoutes = require('./routes/authRoutes');
const PORT = process.env.PORT;
const cors = require('cors');
dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type']
}));

app.use(express.json());
app.use(fileUpload());


app.use('/api', authRoutes);
app.use('/api/sales', salesRoutes);

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
