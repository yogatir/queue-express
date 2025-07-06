const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, queueController.createQueue);
router.post('/call', verifyToken, queueController.callNextQueue);
router.put('/:id/done', verifyToken, queueController.markQueueAsDone);
router.get('/display', queueController.getDisplayQueue);

module.exports = router;