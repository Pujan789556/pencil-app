const Question = require("../../models/questions");
const Topic = require("../../models/topics");

const searchQuestion = (queryString) => new Promise(async (resolve, reject) => {
    try {
        var allTopic = [];

        const _getChildrenTopics = (topic) => new Promise(async (res, rej) => {
            {
                try {
                    allTopic = [...allTopic, topic];
                    const childrenTopic = await Topic.find({
                        'parent': {
                            $eq: topic
                        }
                    })
                    await Promise.all(childrenTopic.map(async (child) => {
                        await _getChildrenTopics(child.topic);
                    }));
                    res(true); 
                } catch (error) {
                    rej(error); 
                }
            }
        })

        await _getChildrenTopics(queryString);
        const questions = await Question.find({
            'annotation': {
                $in: allTopic
            }
        })
        const questionNumbers = questions.map(question => question.qn); 
        resolve(questionNumbers); 
    } catch (error) {
        reject(error);
    }
})

module.exports = {
    searchQuestion
}