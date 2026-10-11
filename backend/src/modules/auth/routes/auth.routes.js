const express = require('express');
const {handleRegister,
        handleVerifyEmail,
        handleResendVerificationEmail,
        handleLogout,
        handleLogin,
        handleForgotPassword,
        handleResetPassword
} = require('../controllers/auth.controller');

const router = express.Router();


router.post('/register',handleRegister);
router.get('/verify-email/:token', handleVerifyEmail)
router.post('/resend-verifiocationEmail',  handleResendVerificationEmail)
router.post('/login',handleLogin)
router.get('/logout', handleLogout)
router.post('/forgot-password', handleForgotPassword);
router.post('/reset-password/:token', handleResetPassword)
module.exports=router;