const mongoose = require('mongoose')


const permissionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'permission name is required'],
        unique:true,
    }
}, {timestamps:true})

const Permission = mongoose.model("Permission", permissionSchema);
module.exports = Permission;