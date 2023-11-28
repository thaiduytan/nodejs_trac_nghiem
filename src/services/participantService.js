const aqp = require("api-query-params");
const bcrypt = require("bcrypt");
const fs = require("fs");
const Participant = require("../models/Participant");
const { isValidEmail, checkEmailExists } = require("../validate/validateAuth");
const { extractToken, verifyToken } = require("../midleware/JWTAction");
const History = require("../models/History");
const Quizz = require("../models/Quiz");

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
  updateProfileService: async (req, data, imageUrl) => {
    const token = extractToken(req);
    const infoPaticipant = verifyToken(token);
    const { username } = data;

    const userId = infoPaticipant.id;

    // check invalid username
    if (!username) {
      return {
        DT: "",
        EM: "Invalid Email",
        EC: -1,
      };
    }

    if (imageUrl) {
      // console.log("ok");
      const imageBuffer = fs.readFileSync(imageUrl.path);
      const imageBase64 = imageBuffer.toString("base64");
      await Participant.updateOne(
        { _id: userId },
        { username: username, image: imageBase64 }
      );
    } else {
      // console.log("ok2");
      await Participant.updateOne(
        { _id: userId },
        { username: username, image: imageUrl }
      );
    }

    return {
      DT: {
        username: username,
      },
      EC: 0,
      EM: "Update success.",
    };
  },
  changePasswordService: async (data, req) => {
    const token = extractToken(req);
    const infoPaticipant = verifyToken(token);
    const { current_password, new_password } = data;
    const myInfor = await Participant.findById(infoPaticipant.id);
    const myPassword = myInfor.password;

    const isTruePassword = await bcrypt.compare(current_password, myPassword);

    if (!current_password || !new_password) {
      return {
        DT: "",
        EM: "Invalid current_password or new_password",
        EC: -1,
      };
    }

    if (!isTruePassword) {
      // console.log("ok");
      return {
        DT: "",
        EC: 0,
        EM: "Thông tin không chính xác",
      };
    }
    // console.log("ok2");
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await Participant.updateOne(
      { _id: infoPaticipant.id },
      { password: hashedPassword }
    );

    return {
      DT: "",
      EC: 0,
      EM: "Cập nhật mật khẩu thành công.",
    };
  },
  getHistoryService: async (req) => {
    const token = extractToken(req);
    const infoPaticipant = verifyToken(token);
    const myHistory = await History.find({
      participant_id: infoPaticipant.id,
    });

    
    const result = await Promise.all(
      myHistory.map(async (history) => {
        const infoQuiz = await Quizz.findById(history.quiz_id).exec();
        return {
          id: history._id,
          participant_id: history.participant_id,
          quiz_id: history.quiz_id,
          total_questions: history.totalQuestions,
          total_correct: history.totalCorrect,
          createdAt: history.createdAt,
          updatedAt: history.updatedAt,
          quizHistory: {
            id: infoQuiz._id,
            name: infoQuiz.name,
            description: infoQuiz.description,
          },
        };
      })
    );

    return {
      DT: {
        data: result,
      },
      EC: 0,
      EM: "Get History succeed",
    };
  },
};
