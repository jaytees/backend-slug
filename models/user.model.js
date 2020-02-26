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
    preferences: [{
      outlet_name: {
        type: String,
        required: false
      },
      outlet_route: {
        type: String,
        required: false
      },
      categories: [{
        category_name: {
          type: String,
          required: false
        },
        category_url: {
          type: String,
          required: false
        },
        component: {
          type: String,
          required: false
        },
      }]

    }]
})

const User = mongoose.model('User', userSchema);

module.exports = User;
