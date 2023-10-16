const cors = require('cors')

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
}

module.exports = cors(corsOptions)