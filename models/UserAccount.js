const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserAccount = new Schema(
  {
    account_name: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserAccount', UserAccount);
