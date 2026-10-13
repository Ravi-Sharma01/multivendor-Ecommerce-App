const mongoose = require('mongoose');

//connect databse 
const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('db connected successfully');
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}



module.exports = connectDb;