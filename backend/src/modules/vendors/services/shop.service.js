const Shop = require("../../shop/models/shop.model");
const axios = require("axios");
const USer = require("../../auth/models/user.model");
const { sandbox } = require("../../../config/env.config");
const SandboxService = require("./gst.service");

class ShopService {
  //create access token
  static #findShop = async ({ gstNumber, panNumber, vendorId }) => {
    const shop = await Shop.findOne({
      $or: [
        { gstNumber: gstNumber },
        { panNumber: panNumber },
        { vendorId: vendorId },
      ],
    });
    return shop;
  };

  //verify gst number
  static becomeVendor = async ({
    shopName,
    description,
    gstNumber,
    panNumber,
    vendorId,
    bankDetails,
    address,
    logo,
  }) => {
    try {
      const shop = await this.#findShop({ gstNumber, panNumber, vendorId });
      if (shop) {
        throw new Error("shop is already exists with this gst and vendor id");
      }

      const verifytGst = await SandboxService.verifyGst({ gstNumber });

      //valid gst check
      if (!verifytGst.data?.validGstin) {
        throw new Error("palese enter a valid gst number");
      }

      //status check ,Suspended' ya 'Cancelled' ya 'Active'
      if (!verifytGst.data.status === "Active") {
        throw new Error(
          "you given gst number is not active ! suspended or cancelled please chack and retry!",
        );
      }
      //acountholdername and gst name compare
      if (verifytGst.data.legalName !== bankDetails.accountHolderName) {
        throw new Error(
          `you gst legal name doesn't match with bank account holder name!`,
        );
      }
      console.log(address.state);
      console.log(verifytGst.data.stateName);
      //address code delhi == 07
      if (verifytGst.data.stateName !== address.state) {
        throw new Error(
          `your state address doesn't match your gst registered address`,
        );
      }

      const newShop = new Shop({
        shopName,
        description,
        address,
        gstNumber,
        panNumber: verifytGst.data.pan.toLowerCase(),
        bankDetails,
        logo,
        vendorId,
        isVerified: true,
      });

      await newShop.save();
      
    } catch (error) {
      throw new Error("gst verifcation failed" + error.message);
    }
  };
}

module.exports = ShopService;
