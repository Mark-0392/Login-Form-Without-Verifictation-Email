// import mongoose from 'mongoose'
const mongoose = require('mongoose')
const User = require('./User')

const Tasks_Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a task'],
    maxLength: [100, 'you cannot enter more than 100 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

module.exports = mongoose.model('Tasks', Tasks_Schema)
