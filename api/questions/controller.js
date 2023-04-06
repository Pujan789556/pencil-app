const {searchQuestion} = require('./repository');

const searchQuestionController = async (req, res, next) => {
    const {q} = req.query;
    try {
        const questionNumbers = await searchQuestion(q);
        res.send(questionNumbers);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    searchQuestionController
}