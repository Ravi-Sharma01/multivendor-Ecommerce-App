const Shop = require("../../shop/models/shop.model");
const ShopService = require("../services/shop.service");

const applyForVendor = async (req, res) => {
  const { 
    shopName,
    description,
    address, 
    gstNumber, 
    panNumber, 
    bankDetails,
  logo } = req.body;
  console.log(bankDetails);

  const vendorId = req.user.role;
  try {
    const response = await ShopService.becomeVendor({
      shopName,
      description,
      gstNumber,
      panNumber,
      vendorId,
      bankDetails,
      address,
      logo
    });

    res.status(200).json({
      message: "vendor application submitted successfully, wait for approval!",
      data: response?.data,
    });
  } catch (err) {
    res.status(500).json({
      message: "internal server error",
      error: err.message,
    });
  }
};


const dashboard = async (req, res)=>{
 res.status(200).json({
  message:`welcome vendor ${req.user?.name}`
 })
}


module.exports = {
  applyForVendor,
  dashboard
};
