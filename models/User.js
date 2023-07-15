const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
  {
    first_name: {
      type: String,
    },
    DOB: {
      type: Date,
    },
    address: {
      type: String,
    },
    phone_number: {
      type: Number,
    },
    state: {
      type: String,
    },
    zip_code: {
      type: String,
    },
    email: {
      type: String,
    },
    gender: {
      type: String,
    },
    userType: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', User);
