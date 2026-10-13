const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
   
    shopName:{
        type:String,
        required:[true, 'name is required']
    },

    description:{
        type:String,
        required:[true, 'description is required']
    },

    address:{
        address:{type:String, required:[true, 'adress is required']},
        state :{type:String, required:[true, 'state is required']},
        city:{type:String, required:[true, 'city name is required']},
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
    bankDetails:{
        accountNumber:{type:String, required:[true, 'acc number is required']},
        ifscCode:{type:String, required:[true, 'ifsc code is required']},
        bankName:{type:String, required:[true, 'bank name is required']},
        accountHolderName:{type:String, required:[true, 'account holder name is requiredf']}
    },

    vendorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true, 'vendor id is required']
    },
    rejectionReason :{
        type:String,
        default:''
    },
    isVerified:{type:Boolean, default:false}
}, {timestamps:true})

const Shop = mongoose.model('Shop', shopSchema, 'shops');
module.exports = Shop;