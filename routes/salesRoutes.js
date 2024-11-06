    const express = require('express');
    const { getUserPdfs, uploadAndRecommend}= require('../controllers/salesController');
    const { authenticateToken } = require('../middlewares/authMiddleware');

    const router = express.Router();

    router.post('/upload-recommend', authenticateToken, uploadAndRecommend);
    //Trae los pdf
    router.get('/user-pdfs', authenticateToken, getUserPdfs);

    module.exports = router;
