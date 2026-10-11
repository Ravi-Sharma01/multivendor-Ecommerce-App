require('dotenv').config();

module.exports = {
    app:{
        port:process.env.PORT || 3000
    },
    db:{
        uri:process.env.MONGO_URI
    },
    jwt:{
        secret:process.env.SECRET_KEY || 'fallback_secret',
        secretExpiresIn:process.env.SECRET_EXPIRES_IN || '15m',
        refreshSecret:process.env.REFRESH_SECRET_KEY || 'falback_refresh_secret',
        refreshExpiresIn:process.env.REFRESH_SECRET_EXPIRES_IN || '30d'
    },
    email:{
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT || 587,
        user:process.env.EMAIL_USERNAME,
        password:process.env.EMAIL_PASSWORD,
        from:process.env.EMAIL_FROM
    },

    sandbox:{
        apikey:process.env.SANDBOX_API_KEY,
        secret:process.env.SANDBOX_API_KEY_SECRET,
        gstVerifyUrl:process.env.SANNDBOX_URL,
        authUrl:process.env.SANBOX_AUTH_URL,
    }
};