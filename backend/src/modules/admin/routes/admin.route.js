const express = require('express');


const router = express.Router();



router.get('/venbdor-applications', handleVendorApplication); // route to get all apply venodrs to manage




module.exports = router;