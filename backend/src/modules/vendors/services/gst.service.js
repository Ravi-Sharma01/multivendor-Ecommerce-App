const { response } = require("express");
const { sandbox } = require("../../../config/env.config");
const axios = require("axios");

class SandboxService {

   //to get accessToken for sandbox 
  static #getSandboxToken = async () => {
    const url =
      sandbox.authUrl || "https://test-api.sandbox.co.in/authenticate";

    const authHeaders = {
      "x-api-key": sandbox.apikey,
      "x-api-secret": sandbox.secret,
    };

    try {
      const authResponse = await axios.post(url, {}, { headers: authHeaders });

      return authResponse.data.access_token;
    } catch (err) {
      throw new Error(
        "could not created acccestoken for sandbox" + err.message,
      );
    }
  };

  //fetch gst data and verify user kyc  
  static verifyGst = async ({ gstNumber }) => {
    try {
      const sanboxAccessToken = await this.#getSandboxToken();
      const headers = {
        "Content-Type": "application/json",
        "authorization": sanboxAccessToken,
        "x-api-key": sandbox.apikey,
        "x-api-version": "1.0.0",
      };

      const payload = { gstin: gstNumber };
      const verifyResponse = await axios.post(sandbox.gstVerifyUrl, payload, {
        headers: headers,
      });

      
      return verifyResponse.data?.data;
    } catch (err) {
      throw new Error("Failed to verify GST number: " + err.message);
    }
  };
}

module.exports = SandboxService;
