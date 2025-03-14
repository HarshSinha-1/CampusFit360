const JWT_USER_PASSWORD = process.env.SECRET_KEY_user;
const JWT_ADMIN_PASSWORD = process.env.SECRET_KEY_admin;
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

module.exports = {
    JWT_ADMIN_PASSWORD,
    JWT_USER_PASSWORD,
    MONGO_URI,
    PORT
}