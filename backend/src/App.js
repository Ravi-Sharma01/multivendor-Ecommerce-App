const express = require('express');
const authRouter = require('./modules/auth/routes/auth.routes');
const userRouter = require('./modules/auth/routes/user.routes');
const vendorRouter = require('./modules/vendors/routes/vendor.route');
require('dotenv').config();
const connectDb = require('./config/db.config');
const cookieParser = require('cookie-parser');
const isAuthenicated = require('./modules/auth/middlewares/auth.middleware');


const app = express();
app.use(express.json());
app.use(cookieParser());
connectDb();

    
   
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users',isAuthenicated, isAuthenicated, userRouter)
app.use('/api/v1/vendor',isAuthenicated, isAuthenicated, vendorRouter)

module.exports = app;