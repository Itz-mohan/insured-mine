const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema(
  {
    message: {
      type: String,
    },
    datetime: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', Message);
