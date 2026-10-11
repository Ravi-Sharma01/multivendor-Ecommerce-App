const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
   
    name:{
        type:String,
        required:[true, 'name is required']
    },

    description:{
        type:String,
        required:[true, 'description is required']
    },

    address:{
        type:String,
        required:[true, 'address is required']
    },
    gstNumber :{
        type:String,
        required:[true, 'gst is required'],
        unique:true,
        trim:true

    },
    panNumber :{
        type:String,
        required:[true, 'pan number is required'],
        unique:true,
        trim:true,
        uppercase:true
    },
    logo:{
        type:String,
        default:''
    },
    bankDertails:{
        accountNumber:{type:String, required:[true, 'acc number is required']},
        ifscCode:{type:String, required:[true, 'ifsc code is required']},
        bankName:{type:String, required:[true, 'bank name is required']},
        accountHolderName:{type:String, required:[true, 'account holder name is requiredf']}
    },

    vendorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true, 'vendor id is required']
    }
})

const Shop = mongoose.model('Shop', shopSchema, 'shops');
module.exports = Shop;