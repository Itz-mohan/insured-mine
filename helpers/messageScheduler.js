const schedule = require('node-schedule');
const moment = require('moment-timezone');

//Models
const TempMessage = require('../models/TempMessage');
const Message = require('../models/Message');

var schedulerJobs = {};

function Scheduler(message) {
  try {
    var dateTime = moment(message.datetime);

    const date = moment.utc(dateTime).toDate();

    console.log(
      `Scheduler is Scheduled successfully at ${moment
        .tz(dateTime, 'America/New_York')
        .format('YYYY-MM-DD HH:mm')} America/New_York timezone`
    );

    schedulerJobs?.[String(message._id)]?.cancel();
    schedulerJobs = {
      ...schedulerJobs,
      [String(message._id)]: schedule.scheduleJob(date, async function () {
        let getMessage = await TempMessage.findOne({ _id: message._id });

        var body = {
          message: getMessage?.message,
          datetime: getMessage?.datetime,
        };

        const createMessage = await Message.create(body);

        console.log('TempMessage transfer successfully to Message');

        const removeTempMessage = await TempMessage.findOneAndDelete({
          _id: message._id,
        });
      }),
    };
  } catch (err) {
    console.log({ err });
  }
}

module.exports = { Scheduler };
