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
    let result = await Participant.find({ deleted: false, ...filter })
      .limit(limit)
      .skip(skip)
      .exec();
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
  createParticipantService: async (data, imageUrl) => {
    const { email, password, username, role, userImage } = data;
    let result;
    let newResult = {};
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

    const hashedPassword = await bcrypt.hash(password, 10);
    if (imageUrl) {
      const imageBuffer = fs.readFileSync(imageUrl.path);
      const imageBase64 = imageBuffer.toString("base64");

      result = await Participant.create({
        email,
        password: hashedPassword,
        username,
        role,
        image: imageBase64,
      });
    }
    if (!userImage) {
      result = await Participant.create({
        email,
        password: hashedPassword,
        username,
        role,
      });
    }

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
  updateParticipantService: async (data, imageUrl) => {
    const { id, username, role, userImage } = data;
    let myPaticipant = await Participant.findOne({ _id: id });
    // // ko dc xoa
    if (
      myPaticipant.email === "admin@gmail.com" ||
      myPaticipant.email === "user@gmail.com" ||
      myPaticipant.email === "tan@gmail.com"
    ) {
      return {
        DT: {
          email: myPaticipant.email,
        },
        EC: -1,
        EM: "Không được phếp update Email mẫu này =_=",
      };
    }

    if (imageUrl) {
      const imageBuffer = fs.readFileSync(imageUrl.path);
      const imageBase64 = imageBuffer.toString("base64");
      await Participant.updateOne(
        { _id: id },
        { username, role, image: imageBase64 }
      );
    }

    if (!userImage) {
      await Participant.updateOne({ _id: id }, { username, role });
    }

    let newResult = {};
    newResult = {
      id: myPaticipant?._id,
      username: myPaticipant?.username,
      role: myPaticipant?.role,
    };
    return {
      DT: newResult,
      EC: 0,
      EM: "Update success.",
    };
  },
  deleteParticipantService: async (data) => {
    const { id } = data;

    const myPaticipant = await Participant.findOne({ _id: id });

    // // ko dc xoa
    if (
      myPaticipant.email === "admin@gmail.com" ||
      myPaticipant.email === "user@gmail.com" ||
      myPaticipant.email === "tan@gmail.com"
    ) {
      return {
        DT: {
          id: "1",
          email: myPaticipant.email,
        },
        EC: -1,
        EM: "Định mệnh - Xóa tài khoản này lấy gì mà test @@",
      };
    }

    await Participant.deleteById(id);
    return {
      DT: {
        id: id,
      },
      EC: 0,
      EM: "Delete the user succeed",
    };
  },
};
