"use strict"

var express = require('express');
var router = express.Router();

// Controllers
var indexController = require('../controller/indexController.js');
var partyController = require('../controller/partyController.js');

// Define routes
router.route('/').get(indexController.index).post(indexController.post);

router.route('/party/:partyId').get(partyController.index);
router.route('/party/:partyId/simple').get(partyController.show);
router.route('/party/:partyId/delete').get(partyController.delete);

module.exports = router;