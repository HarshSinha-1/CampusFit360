const jwt = require('jsonwebtoken');
const JWT_USER_PASSWORD = require('../configs/configs').JWT_USER_PASSWORD;

async function studentmiddleware(req, res, next) {
    try {
        const token = req.headers['token'] || req.headers['authorization'];
        if (!token) return res.status(401).send({ message: 'JWT_Unavailable' });

        const cleanToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

        const decoded = jwt.verify(cleanToken, JWT_USER_PASSWORD);
        console.log("Decoded JWT:", decoded);

        if (!decoded || !decoded.studentId) {
            return res.status(403).send({ message: 'JWT_Invalid or Missing studentId' });
        }

        // Set student data in request
        req.student = {
            _id: decoded.studentId,
            name: decoded.name || "Unknown Student"
        };

        console.log("Student info set:", req.student);

        next();
    } catch (error) {
        return res.status(500).send({
            message: 'Error Occurred',
            error: error.message
        });
    }
}

module.exports = studentmiddleware;
