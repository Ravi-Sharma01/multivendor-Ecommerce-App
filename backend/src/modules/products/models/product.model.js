const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:{
    type: String,
    required:[true, 'please provide a name for this product'],
  },
  price:{
    type:Number,
    required:[true, 'please provide a price for this product'],
  },
  description:{
    type:String,
    required:true,
  },
  category:{
    type:String,
    required:[true, 'please provide a category for this product'],
  }
},{timeStamps:true});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;