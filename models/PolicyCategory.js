const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PolicyCategory = new Schema(
  {
    category_name: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PolicyCategory', PolicyCategory);
