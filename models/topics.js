const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  },
  path: {
    type: String,
    required: true
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }]
});

const Topic = mongoose.model('Topic', TopicSchema);

module.exports = Topic;