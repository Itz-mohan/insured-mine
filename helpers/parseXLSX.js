const xlsx = require('xlsx');

function parseXLSX(file, callback) {
  const workbook = xlsx.read(file, { type: 'buffer' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  const headers = jsonData[0];
  const results = jsonData.slice(1).map((row) => {
    const rowData = {};
    headers.forEach((header, index) => {
      rowData[header] = row[index];
    });
    return rowData;
  });

  callback(results);
}

module.exports = { parseXLSX };
