const csv = require('csv-parser');
const { Readable } = require('stream');

function parserCSV(file, callback) {
  try {
    const results = [];

    const readableStream = new Readable();
    readableStream._read = () => {}; // This is required to create a readable stream

    readableStream.push(file);
    readableStream.push(null); // Signal the end of the stream

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
