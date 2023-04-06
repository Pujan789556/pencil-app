const { Router } = require('express');
const questionRoutes = require('./api/questions')
const router = Router();

router.use('/', questionRoutes);

module.exports = router;