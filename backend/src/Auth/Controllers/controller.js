const EmailService = require("../../services/Email.service");
const Services = require("../Services/service");

const handleRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await Services.registerUser({ name, email, password });
    res.status(201).json({
      message: "user created successfully , check your mail to verify",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "server error",
      error: err.message,
    });
  }
};
const handleVerifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    await EmailService.verifyUserEmail(token);
    res.status(200).json({
      message: "Email verified! you can log in now",
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};
const handleLogin = async(req, res) => {
  try {
    const {email, password} = req.body;
    const {accessToken, refreshToken, user} = await Services.loginUser({email, password});

    res.cookie("accessToken", accessToken,{
      maxAge:15*60*1000,// 15 min
      httpOnly:true,
      secure:false,
    });
    res.cookie('refreshToken', refreshToken,{
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
      secure:false,
      httpOnly:true
    });

    res.status(200).json({
      message:'logged in successfully!',
      user
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message:'internal server error ',
      error:error.message
    })
  }

  
};
const handleResendVerificationEmail = async(req, res)=>{
  try {
    const {email} = req.body;
    await EmailService.resendVerificationEmail({email});
    res.status(200).json({message:'check your inbox to verify email adddress'})
  } catch (error) {
    res.status(500).json({
      message:'internal server error',
      err:error.message
    })
  }
}
const handleLogout = async(req, res) => {
  try {
    const token = req.cookies.accessToken;
    await Services.logoutUser(token);
  
    res.clearCookie('accessToken', {httpOnly:true});
    res.clearCookie('refreshToken', {httpOnly:true});
    res.status(200).json({
      message:'User Logout Successfully!'
    })
  } catch (error) {
    res.status(500).json({
      message:'internal server error',
      err:error.message
    })
  }
  
};

const handleForgotPassword = async(req, res)=>{
  try {
    const {email} = req.body;
    
    await Services.forgotPassword({email});
    res.status(200).json({
      message:'check you mailbox to reset your  password'
    })
  } catch (error) {
    res.status(500).json({
      message:'internal server error',
      err:error.message
    })
  }
}
const handleResetPassword = async(req, res)=>{
  try {
    const token  = req.params.token;
    const {password} =  req.body;
    await Services.resetPassword({password, token});
    res.status(200).json({
      message:'password changed successfully! you can login now!'
    })
  } catch (error) {
    res.status(500).json({
      message:'internal server error',
      err:error.message,
    })
  }
}

module.exports = {
  handleRegister,
  handleVerifyEmail,
  handleResendVerificationEmail,  
  handleLogin,
  handleLogout,
  handleForgotPassword,
  handleResetPassword
};
