const mongoose = require('mongoose');
const  Permission= require('./permission.model')

const roleSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Role name is required'],
        unique:true,
        enum:['customer', 'vendor', 'admin'],
    },
    permissions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Permission',
       
    }]
},{timestamps:true});


const Role  = mongoose.model("Role", roleSchema);
module.exports = Role;
