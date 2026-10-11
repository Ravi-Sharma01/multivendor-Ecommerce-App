const mongoose = require('mongoose')
const  Role = require('./role.model')
const bcrypt = require('bcrypt');
// const crypto = require('node:crypto');
const crypto = require('crypto');

const userSchema = new  mongoose.Schema({
    name:{
        type:String,
        required:[true, 'fill the name']
    },
    email:{
        type:String,
        required:[true, 'please add a email'],
        unique:true
    },
    password:{
        type:String,
        required:[true, 'password is required']
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    refreshToken:String,
    emailVerifactionToken:String,
    emailVerifactionExpiresIn:Date,
    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Role',
        required:[true,'Role must be assign plaese ']
    },

    passwordToken:String,
    passwordTokenExpiresIn:Date,

    vandorApplliactionStatus:{
        type:String,
        enum:['none', 'pending', 'approved', 'rejected'],
        default:'none'
    }
}, {
    timestamps:true
});

//before save password convert into salt 
userSchema.pre("save",async function(){
    //if password not changed or updated then return
    if(!this.isModified('password')) return;
    try {
        const salt = await bcrypt.hash(this.password, 10);
        this.password = salt;
    } catch (error) {
        throw new Error(error.message);
    }
});


//compare password 
userSchema.methods.comparePassword = async function(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password);
}

//generate email verification code function
userSchema.methods.generateEmailVerifactionToken = async function(){
    const token = crypto.randomBytes(32).toString('hex');
    this.emailVerifactionToken = token;
    this.emailVerifactionExpiresIn = Date.now() + 30 * 60 * 1000 // 30 minutes
    await this.save();
    return token;
}

//generate token for psssword reset
userSchema.methods.generatePasswordToken = async function () {
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordToken = token;
    this.passwordTokenExpiresIn = Date.now() + 5 * 60 * 1000 // 5 min valid
    await this.save();
    return token;
}

const User = mongoose.model("User", userSchema);
module.exports=User;