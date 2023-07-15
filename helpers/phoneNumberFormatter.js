function PhoneNumberFormat(number) {
  var phoneNumber;

  if (typeof number === 'string') {
    phoneNumber = number;
  } else if (typeof number === 'number') {
    phoneNumber = number.toString();
  }

  const regex = phoneNumber.replace(/\D/g, '');

  return regex;
}

module.exports = { PhoneNumberFormat };
