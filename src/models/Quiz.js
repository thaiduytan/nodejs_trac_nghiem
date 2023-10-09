const mongoose = require("mongoose");

const quizzSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    image: String,
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"], // Đặt giá trị hợp lệ cho độ khó
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Quizz = mongoose.model("quizz", quizzSchema);

module.exports = Quizz;
