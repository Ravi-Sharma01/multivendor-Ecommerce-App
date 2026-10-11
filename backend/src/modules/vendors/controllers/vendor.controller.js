
const Shop = require('../../shop/models/shop.model');
const ShopService = require('../services/shop.service');

const applyForVendor = async(req, res )=>{
    const{
        name,
        description,
        address,
        gstNumber,
        panNumber,
        bankDetails
    
    }  = req.body;

    const vendorId = req.user.role;
    try{
    const response = await ShopService.becomeVendor({gstNumber, panNumber, vendorId});
    console.log(response);


    res.status(200).json({
        message:'vendor application submitted successfully, wait for approval!',
        response
    })
    }catch(err){
        res.status(500).json({
            message: 'internal server error',
            error: err.message
        })
    }   
}

module.exports = {
    applyForVendor
}