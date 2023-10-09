const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    participant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "participant",
    },
    quiz_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quizz",
    },
    totalQuestions: Number, // Sử dụng kiểu dữ liệu Number cho số lượng câu hỏi
    totalCorrect: Number, // Sử dụng kiểu dữ liệu Number cho số lượng câu trả lời đúng
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const History = mongoose.model("history", historySchema);

module.exports = History;
