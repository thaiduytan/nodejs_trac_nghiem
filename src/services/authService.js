const Participant = require("../models/Participant");
const { isValidEmail } = require("../validate/validateEmail");

module.exports = {
  createRegisterService: async (data, res) => {
    const { email, password, username } = data;

    if (isValidEmail(email)) {
      // Kiểm tra xem EMAIL đã tồn tại trong cơ sở dữ liệu hay chưa
      const existingParticipant = await Participant.findOne({ email });
      if (existingParticipant) {
        return res.status(200).json({
          DT: "",
          EC: -1,
          EM: "User with the email already exists",
        });
      }
    } else {
      return res.status(200).json({
        DT: "",
        EM: "Invalid Email",
        EC: -1,
      });
    }

    if (!password || !username) {
      return res.status(400).json({
        DT: "",
        EC: -2,
        EM: "Invalid password or username",
      });
    }

    await Participant.create({ email, password, username });
    return res.status(200).json({
      DT: "",
      EC: 0,
      EM: "Register success!",
    });
  },
};
