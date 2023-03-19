const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController');
const mainController = require('../controllers/mainController');


router.get('/', indexController.home);
router.get('/first', mainController.first);
router.get('/second', mainController.second);

module.exports = router;
