const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];


    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado: token no proporcionado' });
    }


    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token no válido o expirado' });
        }
        
        // Almacenar el ID de usuario en el request para futuros usos
        req.userId = decoded.userId;
        next();
    });
};
