const express = require("express");
const isAuthenicated = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const router = express.Router();

router.get("/user",isAuthenicated, authorize("customer", "admin"), (req, res) => {
  res.status(200).json({
    message: `welocme user`,
  });
});

router.get('/vendor',isAuthenicated, authorize("vendor", "admin"), (req, res)=>{
    res.status(200).json({
        message:`welcome vendor`
    })
})

router.get('/admin',isAuthenicated, authorize("admin"), (req, res)=>{
    res.status(200).json({
        message:`welcome admin`
    })
})


module.exports = router;
