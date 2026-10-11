const { verify } = require("crypto");
const TokenService = require("../../../shared/services/token.service");
const { log } = require("console");

const isAuthenicated = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(400).json({
        message: "invalid token",
      });
    }

    const decode = TokenService.verifyAccesToken(token);
    if (!decode) {
      return res.status(400).json({
        message: "invalid or expired token",
      });
    }

    req.user = decode;
    console.log(req.user);
    
    next();
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = isAuthenicated;
