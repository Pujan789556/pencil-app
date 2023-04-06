const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
    index: true
  },
  annotation: {
    type: [String],
    validate: [(str) => str.length, 'Must have at lease one annotation'],
    index: true
  },
});

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;