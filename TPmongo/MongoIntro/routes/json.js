const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.json);
router.get('/random', mainController.jsonRandom);

module.exports = router;
