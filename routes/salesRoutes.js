    const express = require('express');
    const ventasController = require('../controllers/salesController');

    const router = express.Router();

    // Ruta para subir el PDF y obtener recomendaciones
    router.post('/upload-recommend', ventasController.uploadAndRecommend);

    module.exports = router;
