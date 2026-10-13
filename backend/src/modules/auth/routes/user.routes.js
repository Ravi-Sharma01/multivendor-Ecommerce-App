const express = require("express");
const isAuthenicated = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const router = express.Router();

router.get("/user",isAuthenicated, authorize("customer", "admin"), (req, res) => {
  res.status(200).json({
    message: `welocme user`,
  });
});



router.get('/admin',isAuthenicated, authorize("admin"), (req, res)=>{
    res.status(200).json({
        message:`welcome admin`
    })
})


module.exports = router;
