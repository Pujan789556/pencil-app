const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }]
});

const autoPopulateChildren = function(next) {
    this.populate('children');
    next();
};

TopicSchema
.pre('findOne', autoPopulateChildren)
.pre('find', autoPopulateChildren)

const Topic = mongoose.model('Topic', TopicSchema);

module.exports = Topic;