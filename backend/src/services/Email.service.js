const nodemailer = require('nodemailer');
const { email } = require('../config/env.config');
const User = require('../Auth/models/user.model');


class EmailService {
    static async #sendmail({ to, subject, html }) {
        const transpoter = nodemailer.createTransport({
            host: email.host,
            port: email.port,
            auth: {
                user: email.user,
                pass: email.password
            }
        });

        const mailOptions = {
            from: `Email Verication  App ${email.from}`,
            to,
            subject,
            html
        };

        await transpoter.sendMail(mailOptions);
    };

    static async sendVerificationEmail({ name, email, token }) {
        const emailVerifyLink = `http://localhost:3000/api/v1/auth/verify-email/${token}`;
        await this.#sendmail({
            to: email,
            subject: "Verify Email Address",
            html: `

             <h2>Hello ${name}!</h2>
            <p>Thanks for registering. Please verify your email by clicking the link below:</p>
            <a href="${emailVerifyLink}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
                Verify Email
            </a>
            <p>This link expires in 24 hours.</p>
            <p>If you didn't register, ignore this email.</p>
            `,
        })
    }

    static async resendVerificationEmail({email}){
        const user = await User.findOne({
            email,
            isVerified:false
        });

        if(!user) throw new Error ('Email is already Verifed! you can login!');

        if(user.emailVerifactionToken && user.emailVerifactionExpiresIn > Date.now()){
            throw new Error('please check your inbox , link expires in 30 minutes')
        }

        const name = user.name;
        const token = await user.generateEmailVerifactionToken();
        
        await this.sendVerificationEmail({name, email, token});
    
    }

    static async verifyUserEmail(token){
        const user = await User.findOne({
            emailVerifactionToken:token,
            emailVerifactionExpiresIn:{$gt : Date.now()}
        });

        if(!user) throw new Error('invalid or expired email vrifcation token ');
        user.isVerified=true;
        user.emailVerifactionToken = undefined;
        user.emailVerifactionExpiresIn = undefined;
        await user.save();
    }
};

module.exports = EmailService;