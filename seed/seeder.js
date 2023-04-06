const mongoose = require("mongoose");
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Topic = require('../models/topics');
const Question = require("../models/questions");

dotenv.config();
const uri = process.env.MONGOSTRING;
mongoose
  .connect(uri)
  .catch(err => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(() => {
    const rows = [];
    console.log('DB Connected');
    console.log('Seeding Topic Data...')
    fs.createReadStream(path.resolve(__dirname, 'topic.csv'))
    .pipe(csv())
    .on('error', error => console.error(error))
    .on('data', (row) => {
      const outputRow = parseRow(row);
      rows.push(outputRow);
    })
    .on('end',() => {
       Topic.deleteMany({}, async() => {
      for(let i=0; i<rows.length; i++) {
        await saveNode(null, rows[i])
      }
        console.log('Topic data seeded completely')
      })
    });

    console.log('Seeding Question Data...')
    var questionsRow = [];
    fs.createReadStream(path.resolve(__dirname, 'question.csv'))
    .pipe(csv())
    .on('error', error => console.error(error))
    .on('data', row => questionsRow.push(row))
    .on('end', rowCount => {
      Question.deleteMany({}, async() => {
        for(var i = 0; i< questionsRow.length; i++) {
            var questionData = {};
            for(var q in questionsRow[i]) {
                if(q !== '' && q === 'Question number') {
                    questionData.questionNumber = questionsRow[i][q]
                } else if(q !== '' && questionsRow[i][q] !== '') {
                    if(!questionData.annotation) questionData.annotation = [];
                    questionData.annotation.push(questionsRow[i][q].trimEnd())
                }
            }
           await Question.create(questionData)
        }
        console.log('Question Data Seeding Complete');
      });
    });
  });


const parseRow = (obj) => {
  const keys = Object.keys(obj).filter(key => key !== '');
  if (keys.length === 1) {
    const name = obj[keys[0]].trimEnd();
    return { name };
  } else {
    const name = obj[keys[0]].trimEnd();
    const childObj = keys.slice(1).reduce((acc, key) => {
      if(obj[key] !== '')acc[key] = obj[key];
      return acc;
    }, {});
    const child = parseRow(childObj);
    return { name, child };
  }
}

const saveNode = async (parent, node) => {
 let newNode = await Topic.findOne({name: node.name});
 if(!newNode) {
   newNode = new Topic({
    name: node.name,
    parent: parent ? parent._id : null,
    path: parent ? `${parent.path}/${node.name}`: node.name
  })
  await Topic.create(newNode);
 }
if(node.child) {
  const nodeParent = await Topic.findById(newNode._id);
  await saveNode(nodeParent, node.child);
}
if(parent) {
  if(!parent.children) parent.children = []
  parent.children = parent.children.map(child => child._id)
  if(!parent.children.includes(newNode._id)) {
    parent.children.push(newNode._id)
    await Topic.findByIdAndUpdate(parent._id, parent);
  }
}
}
