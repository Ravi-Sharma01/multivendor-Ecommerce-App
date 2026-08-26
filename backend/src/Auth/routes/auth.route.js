const express = require('express');
const {handleRegister,
        handleVerifyEmail,
        handleResendVerificationEmail,
        handleLogout,
        handleLogin
} = require('../Controllers/controller');

const router = express.Router();


router.post('/register',handleRegister);
router.get('/verify-email/:token', handleVerifyEmail)
router.post('/resend-verifiocationEmail',  handleResendVerificationEmail)
router.post('/login',handleLogin);
router.post('/logout', handleLogout)
module.exports=router;