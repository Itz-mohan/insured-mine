const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TempMessage = new Schema(
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

module.exports = mongoose.model('TempMessage', TempMessage);
