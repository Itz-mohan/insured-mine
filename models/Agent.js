const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Agent = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Agent', Agent);
