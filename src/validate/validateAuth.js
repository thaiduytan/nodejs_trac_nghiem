const Participant = require("../models/Participant");
const bcrypt = require("bcrypt");
module.exports = {
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  checkPasswordCorrect: (inputPW, hashPW) => {
    return bcrypt.compareSync(inputPW, hashPW); //true /false
  },
  checkEmailExists: async (email) => {
    const existingEmail = await Participant.find({ deleted: false, email });
    return existingEmail;
  },
};
