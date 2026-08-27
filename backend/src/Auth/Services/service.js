const User = require("../models/user.model");
const Role = require("../models/role.model");
const EmailService = require("../../services/Email.service");
const TokenService = require("../../Services/token.service");

class Services {
  //register new user
  static registerUser = async ({ name, email, password }) => {
    const user = await User.findOne({ email }); //find user in db

    //id user exist then return with err
    if (user) {
      const error = new Error("Email is already exist!");
      error.statusCode = 409;
      throw error;
    }

    //fetch customer role for customer-role-id
    const customerRole = await Role.findOne({ name: "customer" });

    //if customer role is not defined in Role collection in db then also return from here
    if (!customerRole) {
      const error = new Error("Customer role is not seeded");
      error.statusCode = 500;
      throw error;
    }

    //genrate acesstoken

    const newUser = new User({
      name,
      email,
      password,
      role: customerRole._id,
    });
    await newUser.save();

    const token = await newUser.generateEmailVerifactionToken();
    await EmailService.sendVerificationEmail({ name, email, token });

    return {
      name,
      email,
    };
  };

  static loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }); //find user in db

    //if user not exist
    if (!user || user == null)
      throw new Error("user not found please register!");

    //check user is email verified to login or not
    // if(!user.isVerified){

    // }

    //match candidate password
    const matchPassword = await user.comparePassword(password);
    if (!matchPassword) throw new Error("invalid email or wrong password");

    //genrate jwt tokens
    const payload = { id: user._id, email: user.email, role: user.role };
    const accessToken = TokenService.generateAccessToken(payload);
    const refreshToken = TokenService.generateRefreshToken(payload);

    //save refresh token in db to renew acces token on every 15m
    user.refreshToken = refreshToken;
    await user.save();

    return {
      refreshToken,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  };

  static logoutUser = async (token) => {
    const decode = TokenService.verifyAccesToken(token);
    if (!decode) throw new Error("unauthorized , invalid token");

    const user = await User.findById({ _id: decode.id });
    if (!user) throw new Error("user not found");

    user.refreshToken = undefined;
    user.save();
  };

  static forgotPassword = async ({ email }) => {
    if (!email) throw new Error("email is required");
    const user = await User.findOne({ email });
    if (!user) throw new Error("user not found");

    const tokenIsValid = 
      user.passwordToken && 
      user.passwordTokenExpiresIn && 
      user.passwordTokenExpiresIn > Date.now();

    if(tokenIsValid) throw new Error('Paassword link alreday Sent. Please check your email. and try after sometime!')
    const name = user.name;
    const token = await user.generatePasswordToken();
    await EmailService.sendPasswordLinkEmail({name, email, token });
  };

  static resetPassword = async ({password, token})=>{
    if(!token) throw new Error("missing token ")
    if (!password) throw new Error("password is required");
    const user =  await User.findOne({
      passwordToken:token,
      passwordTokenExpiresIn:{$gt :Date.now()}
    });

    if(!user) throw new Error('invalid or expired token');

    user.password = password;
    user.passwordToken = undefined;
    user.passwordTokenExpiresIn=undefined;
    await user.save();
  }
}

module.exports = Services;
