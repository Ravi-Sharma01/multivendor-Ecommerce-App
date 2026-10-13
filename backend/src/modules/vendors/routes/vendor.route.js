const express = require('express');
const isAuthenicated = require('../../auth/middlewares/auth.middleware');
const authorize = require('../../auth/middlewares/authorize.middleware');
const { 
    applyForVendor,
    dashboard} = require('../controllers/vendor.controller');

const router = express.Router();
//routes
router.post('/apply', applyForVendor);
router.get('/dashboard',isAuthenicated, authorize("vendor", "admin"), dashboard);

module.exports = router;

