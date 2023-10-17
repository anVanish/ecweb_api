const jwt = require('jsonwebtoken')

class TokenService{
    constructor(){
        this.secretKey = process.env.SECRET_KEY
    }
    generateAccessToken(data, expiresIn = '7d'){
        return jwt.sign({data}, this.secretKey, {expiresIn})
    }

    decodeAccessToken(token){
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            return null;
        }
    }
}

module.exports = new TokenService()