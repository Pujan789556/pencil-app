const Question = require("../../models/questions");
const Topic = require("../../models/topics");

const searchQuestion = (queryString) => new Promise(async (resolve, reject) => {
    var allTopic = []

    const _getChildrenTopics = (children) => new Promise(async (res, rej) => {
        for(const child of children) {
            allTopic = [...allTopic, child.name]
            if(child.children.length) _getChildrenTopics(child.children)
        }
    })

    try {
        const rootTopic = await Topic.findOne({
            'name': {
                $eq: queryString
            }
        })
        if(rootTopic) {
            allTopic.push(rootTopic.name)
            if(rootTopic.children.length) {
                _getChildrenTopics(rootTopic.children)
            }
            const questions = await Question.find({
                'annotation': {
                    $in: allTopic
                }
            })
            const questionNumbers = questions.map(question => question.questionNumber); 
            resolve(questionNumbers.sort((a,b)=> a-b)); 
        }
        resolve([]);
    } catch (error) {
        reject(error);
    }
})

module.exports = {
    searchQuestion
}