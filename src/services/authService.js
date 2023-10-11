const Participant = require("../models/Participant");
const bcrypt = require("bcrypt");
const {
  isValidEmail,
  checkEmailExists,
  checkPasswordCorrect,
} = require("../validate/validateAuth");

module.exports = {
  // =====================================================================================================
  createRegisterService: async (data, res) => {
    const { email, password, username } = data;

    if (isValidEmail(email)) {
      // Kiểm tra xem EMAIL đã tồn tại trong cơ sở dữ liệu hay chưa
      const isExistingEmail = await checkEmailExists(email);
      if (isExistingEmail) {
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

    const hashedPassword = await bcrypt.hash(password, 10);

    await Participant.create({ email, password: hashedPassword, username });
    return res.status(200).json({
      DT: "",
      EC: 0,
      EM: "Register success!",
    });
  },
  loginService: async (data, res) => {
    const { email, password } = data;

    const user = await Participant.findOne({
      $or: [{ email: email }, { username: email }],
    });

    // console.log("loginService: >>> user:", user);

    if (user) {
      const isCorrectPassword = checkPasswordCorrect(password, user.password);
      if (isCorrectPassword) {
        // { 200
        //   "DT": {
        //       "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ld3NAZ21haWwuY29tIiwicm9sZSI6IlVTRVIiLCJpZCI6NTAsImlhdCI6MTY5NjkyNDgxMCwiZXhwIjoxNzI4NDYwODEwfQ.FaC60ZbGJTOE87bIQT1p4Ty92EruIqXmg6qGlHzmydg",
        //       "refresh_token": "8055d858-9692-4f0b-bd50-ea3b26eb84e5",
        //       "username": "qwee",
        //       "role": "USER",
        //       "email": "news@gmail.com",
        //       "image": ""
        //   },
        //   "EC": 0,
        //   "EM": "Login succeed"
        // }
        return res.status(200).json({
          DT: {
            username: user.username,
            role: user.role,
            email: user.email,
            image: user.image,
          },
          EC: 0,
          EM: "Login succeed",
        });
      } else {
        return res.status(200).json({
          DT: "",
          EC: -1,
          EM: "Your email/password is incorrect",
        });
      }
    }

    return res.status(200).json({
      DT: "",
      EC: -1,
      EM: "Not found user with the email",
    });
  },
};
