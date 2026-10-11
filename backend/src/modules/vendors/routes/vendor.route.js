const express = require('express');
const { applyForVendor} = require('../controllers/vendor.controller')
const router = express.Router();


//routes
router.post('/apply', applyForVendor);


module.exports = router;

