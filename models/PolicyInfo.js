const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PolicyInfo = new Schema(
  {
    policy_number: {
      type: String,
    },
    policy_start_date: {
      type: Date,
    },
    policy_end_date: {
      type: Date,
    },
    policy_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PolicyCategory',
    },
    // collection_id: {},
    // company_collection_id: {},
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PolicyInfo', PolicyInfo);
