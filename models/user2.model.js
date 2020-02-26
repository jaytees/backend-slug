const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    register_date: {
      type: Date,
      default: Date.now
    },
    preferences: {
      outlet_name: {
        category_name: {
          type: String,
          required: false
        },
      }
    }
})

const User2 = mongoose.model('User2', userSchema);

module.exports = User2;
