const csv = require('csv-parser');
const { Readable } = require('stream');

function parserCSV(file, callback) {
  try {
    const results = [];

    const readableStream = new Readable();
    readableStream._read = () => {};

    readableStream.push(file);
    readableStream.push(null);

    readableStream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        callback(results);
      });
  } catch (err) {
    console.log({ err });
  }
}

module.exports = { parserCSV };
