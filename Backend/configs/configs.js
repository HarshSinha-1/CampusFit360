const JWT_USER_PASSWORD = process.env.SECRET_KEY_user;
const JWT_ADMIN_PASSWORD = process.env.SECRET_KEY_admin;
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;

module.exports = {
    JWT_ADMIN_PASSWORD,
    JWT_USER_PASSWORD,
    MONGO_URI,
    PORT,
    API_KEY
}