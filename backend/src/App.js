const express = require('express');
const authRouter = require('./Auth/routes/auth.route');
const userRouter = require('./Auth/routes/user.route')
require('dotenv').config();
const connectDb = require('./config/db.config');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());
connectDb();

    
   
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)

module.exports = app;