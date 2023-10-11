const aqp = require("api-query-params");
const bcrypt = require("bcrypt");
const fs = require("fs");
const Participant = require("../models/Participant");
const { isValidEmail, checkEmailExists } = require("../validate/validateAuth");

module.exports = {
  getParticipantService: async (queryString) => {
    // pagination
    let page = queryString.page;
    const { limit, filter } = aqp(queryString);
    delete filter.page; // xoa page
    let skip = (page - 1) * limit;

    // Truy vấn tổng số lượng dữ liệu
    const totalCount = await Participant.countDocuments({});
    // Tính totalPages dựa trên totalCount và limit
    const totalPages = Math.ceil(totalCount / limit);

    // populate (de truy xuat du lieu user)
    let result = await Participant.find(filter).limit(limit).skip(skip).exec();
    let newResult = [];
    for (let i = 0; i < result.length; i++) {
      newResult.push({
        id: result[i]?._id,
        username: result[i]?.username,
        email: result[i]?.email,
        role: result[i]?.role,
        image: result[i]?.image ? result[i]?.image : "",
      });
    }
    return {
      totalCount,
      totalPages,
      newResult,
    };
  },
  createParticipantService: async (data, imageUrl, res) => {
    const { email, password, username, role } = data;

    if (isValidEmail(email)) {
      const isExistingEmail = await checkEmailExists(email);
      if (isExistingEmail) {
        return {
          DT: "",
          EC: -1,
          EM: "User with the email already exists",
        };
      }
    } else {
      return {
        DT: "",
        EM: "Invalid Email",
        EC: -1,
      };
    }
    if (!email || !password) {
      return {
        DT: "",
        EM: "Invalid Input Email/Password",
        EC: -1,
      };
    }

    const imageBuffer = fs.readFileSync(imageUrl.path);
    const imageBase64 = imageBuffer.toString("base64");

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await Participant.create({
      email,
      password: hashedPassword,
      username,
      role,
      image: imageBase64,
    });

    let newResult = {};
    newResult = {
      id: result?._id,
      username: result?.username,
      email: result?.email,
      role: result?.role,
      createdAt: result.createdAt,
    };
    return {
      DT: newResult,
      EC: 0,
      EM: "Create a new participant succeed",
    };
  },
  updateParticipantService: () => {},
  deleteParticipantService: () => {},
};
