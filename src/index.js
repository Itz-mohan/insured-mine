const moment = require('moment-timezone');

//Helpers
const { parserCSV } = require('../helpers/parseCSV');
const { parseXLSX } = require('../helpers/parseXLSX');
const { PhoneNumberFormat } = require('../helpers/phoneNumberFormatter');
const { Scheduler } = require('../helpers/messageScheduler');

//Modles
const Agent = require('../models/Agent');
const PolicyCarrier = require('../models/PolicyCarrier');
const PolicyCategory = require('../models/PolicyCategory');
const PolicyInfo = require('../models/PolicyInfo');
const User = require('../models/User');
const UserAccount = require('../models/UserAccount');
const TempMessage = require('../models/TempMessage');

//Upload CSV/XLSX File Function
const Upload = async (req, res) => {
  try {
    const file = req.file;

    var data;
    var agent;
    var user;
    var userAccount;
    var category;
    var carrier;
    var policyInfo;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    var parsedData = (parsedCSV) => {
      data = parsedCSV;
    };

    if (file.mimetype === 'text/csv') {
      await parserCSV(file.buffer, parsedData);
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      await parseXLSX(file.buffer, parsedData);
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    for (let i = 0; i < data?.length; i++) {
      let agentName = data[i]['agent'];

      agent = await Agent.findOneAndUpdate(
        { name: agentName },
        { $set: { name: agentName } },
        { new: true, upsert: true }
      );

      let userData = {
        first_name: data[i]['firstname'],
        DOB: data[i]['dob'],
        address: data[i]['address'],
        phone_number: PhoneNumberFormat(data[i]['phone']),
        state: data[i]['state'],
        zip_code: data[i]['zip'],
        email: data[i]['email'],
        gender: data[i]['gender'],
        userType: data[i]['userType'],
      };

      user = await User.findOneAndUpdate(
        { email: data[i]['email'] },
        { $set: userData },
        { new: true, upsert: true }
      );

      let userAccountData = {
        account_name: data[i]['account_name'],
        user_id: user['_id'],
      };

      userAccount = await UserAccount.findOneAndUpdate(
        { user_id: user['_id'] },
        { $set: userAccountData },
        { new: true, upsert: true }
      );

      let lobData = {
        category_name: data[i]['category_name'],
      };

      category = await PolicyCategory.findOneAndUpdate(
        { category_name: data[i]['category_name'] },
        { $set: lobData },
        { new: true, upsert: true }
      );

      let carrierData = {
        company_name: data[i]['company_name'],
      };

      carrier = await PolicyCarrier.findOneAndUpdate(
        { company_name: data[i]['company_name'] },
        { $set: carrierData },
        { new: true, upsert: true }
      );

      let policyInfoData = {
        policy_number: data[i]['policy_number'],
        policy_start_date: data[i]['policy_start_date'],
        policy_end_date: data[i]['policy_end_date'],
        policy_category: category['_id'],
        // collection_id: ,
        // company_collection_id: ,
        user_id: user['_id'],
      };

      policyInfo = await PolicyInfo.findOneAndUpdate(
        { policy_number: data[i]['policy_number'] },
        { $set: policyInfoData },
        { new: true, upsert: true }
      );
    }

    return res.status(200).json({ msg: 'File Uploaded Successfully' });
  } catch (err) {
    console.log({ err });
  }
};

//Search PolicyInfo By Using Username Function
const SearchPolicyInfo = async (req, res) => {
  try {
    var searchValue = req?.query?.username;

    const pipeline = [
      {
        $match: {
          account_name: {
            $regex: searchValue,
            $options: 'i',
          },
        },
      },
      {
        $lookup: {
          from: 'policyinfos',
          localField: 'user_id',
          foreignField: 'user_id',
          as: 'policyInfoData',
        },
      },
    ];

    const search = await UserAccount.aggregate(pipeline);

    return res.status(200).json({ Data: search });
  } catch (err) {
    console.log({ err });
  }
};

const PolicyByEachUser = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: '$user_id',
          count: { $sum: 1 },
          policyNumbers: { $push: '$policy_number' },
        },
      },
    ];

    const data = await PolicyInfo.aggregate(pipeline);

    return res
      .status(200)
      .json({ msg: 'Data fetched successfully', Data: data });
  } catch (err) {
    console.log({ err });
  }
};

const Message = async (req, res) => {
  try {
    const timezone = 'America/New_York';

    const { message, date, time } = req.body;

    // Convert the given date & time to America/New_York timezone
    const dateTime = moment.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', timezone);

    var body = {
      message: message,
      datetime: dateTime,
    };

    const createTempMessage = await TempMessage.create(body);

    await Scheduler(createTempMessage);

    return res.status(200).json({ msg: 'Scheduler Scheduled Successfully' });
  } catch (err) {
    console.log({ err });
  }
};

module.exports = { Upload, SearchPolicyInfo, PolicyByEachUser, Message };
