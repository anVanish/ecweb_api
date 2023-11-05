const cors = require('cors')

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'https://tiny-jade-elk-wear.cyclic.cloud', 'https://ecwebsite.onrender.com/'];
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
}

module.exports = cors(corsOptions)