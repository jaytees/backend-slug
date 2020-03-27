const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-type-email");
mongoose.SchemaTypes.Email.defaults.message =
  "Please enter a valid email address";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please enter a username"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be a minimum of 3 characters"]
  },
  email: {
    type: [mongoose.SchemaTypes.Email],
    required: [true, "Please enter a email"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please enter a password"]
    // minlength: [6, "Password must be a minimum of 6 characters"]
  },
  register_date: {
    type: Date,
    default: Date.now
  },
  preferences: Schema.Types.Mixed
});

const User = mongoose.model("User", userSchema);

module.exports = User;
