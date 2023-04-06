const { Router } = require('express');
const { searchQuestionController } = require('./controller');
const router = Router();

router.get('/search', searchQuestionController);

module.exports = router;