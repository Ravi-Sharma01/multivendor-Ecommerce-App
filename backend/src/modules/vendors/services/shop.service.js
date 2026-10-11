const Shop = require('../../shop/models/shop.model');
const axios = require('axios');
const USer = require('../../auth/models/user.model');
const { sandbox } = require('../../../config/env.config');
const SandboxService = require('../services/sandbox.service');

class ShopService {
    static #findShop = async ({ gstNumber, panNumber, vendorId }) => {
        const shop = await Shop.findOne({
            $or:[{gstNumber: gstNumber},
            {panNumber: panNumber},
            {vendorId: vendorId}
        ]
        })
        return shop;
    }


    static becomeVendor = async ({ gstNumber, panNumber, vendorId }) => {
        try {
            const shop = await this.#findShop({ gstNumber, panNumber, vendorId });
            if (shop) {
                throw new Error('shop is already exists with this gst and vendor id');
            }

            const verifytGst = await SandboxService.verifyGst({gstNumber});
            return verifytGst;

        } catch (error) {
            throw new Error('gst verifcation failed' + error.message);
        }

    }
}

module.exports = ShopService;