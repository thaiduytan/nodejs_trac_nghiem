const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      //   unique: true, // Đảm bảo email là duy nhất
    },
    password: {
      type: String,
      required: true,
      //   unique: true, // Đảm bảo email là duy nhất
    },
    username: {
      type: String,
      required: true,
      //   unique: true, // Đảm bảo email là duy nhất
    },
    role: {
      type: String,
      enum: ["USER", "ADMIM"], // Đặt giá trị hợp lệ cho vai trò
      default: "USER", // Giá trị mặc định là 'user'
    },
    image: String,
    refresh_token: String,
    refresh_expired: Date, // Sử dụng kiểu dữ liệu Date cho thời gian hết hạn
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Participant = mongoose.model("participant", participantSchema);

module.exports = Participant;
