const jwt = require('jsonwebtoken');
const {jwt : jwtConfig} = require('../../config/env.config')


class TokenService{

    //genrate Access Token
    static generateAccessToken(payload){
        return jwt.sign(payload, jwtConfig.secret,{
            expiresIn:jwtConfig.secretExpiresIn,
        });
    }

    //genrate refreshToken
    static generateRefreshToken(payload){
        return jwt.sign(payload, jwtConfig.refreshSecret,{
            expiresIn:jwtConfig.refreshExpiresIn,
        })
    }

    //verify access token
    static verifyAccesToken(token){
        try {
            return jwt.verify(token, jwtConfig.secret);
        } catch (error) {   
            console.log(error.name)
            return null;
        }
    }

    //verify refrersh token
    static verifyRefrteshToken(token){
        try {
            return jwt.verify(token, jwtConfig.refreshSecret);
        } catch (error) {
            console.log(error.name);
            return null;           
        }
    }
}

module.exports = TokenService;