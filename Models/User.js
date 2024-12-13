const mongoose = require('mongoose')
const validator = require('validator')

// hashing password
const bycrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your first name'],
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please enter the email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please enter your email address',
    },
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },

  passwordToken: String,
  passwordExpirationDate: Date,
})

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bycrypt.genSalt(10)
  this.password = await bycrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (incomingPassword) {
  const Does_The_Password_Match = await bycrypt.compare(
    incomingPassword,
    this.password
  )
  return Does_The_Password_Match
}

module.exports = mongoose.model('User', UserSchema)

// firstName: {
//   type: String,
//   required: [true, 'Please enter your first name'],
//   minLength: 2,
//   maxLength: 50,
// },
// lastName: {
//   type: String,
//   required: [true, 'Please enter your last name'],
//   minLength: 2,
//   maxLength: 50,
// },
