const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const { model } = require('mongoose')

dotenv.config()

class TokenService{
    constructor(){
        this.secretKey = process.env.SECRET_KEY
    }
    generateAccessToken(data){
        return jwt.sign({data}, this.secretKey, {expiresIn: '7d'})
    }

    decodeAccessToken(token){
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            return null;
        }
    }
}

module.exports = TokenService