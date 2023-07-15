const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PolicyCarrier = new Schema(
  {
    company_name: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PolicyCarrier', PolicyCarrier);
