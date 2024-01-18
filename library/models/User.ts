// const { model, Schema } = require('mongoose')
import { model, Schema } from "mongoose";

const userSchema = new Schema({
  login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  displayName: {
    type: String
  },
  email: {
    type: String
  }
})

// module.exports = model('User', userSchema)
export = model('User', userSchema)
