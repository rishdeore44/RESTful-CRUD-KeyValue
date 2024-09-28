// routes/resourceRoutes.js
const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

router.post('/plan', resourceController.createResource);
router.get('/plan/:id', resourceController.getResource);
router.delete('/plan/:id', resourceController.deleteResource);
router.get('/plans', resourceController.getAllResources);


module.exports = router;
