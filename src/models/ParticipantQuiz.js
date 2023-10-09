const mongoose = require("mongoose");

const participantQuizSchema = new mongoose.Schema(
  {
    participant_id: [
      { type: mongoose.Schema.Types.ObjectId, ref: "participant" },
    ],
    quiz_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "quizz" }],
    isFinish: {
      type: Boolean,
      default: false, // Giả sử mặc định là chưa hoàn thành
    },
    timeStart: {
      type: Date,
      default: Date.now, // Giả sử mặc định là thời gian hiện tại
    },
    timeEnd: Date,
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const ParticipantQuiz = mongoose.model(
  "participantQuiz",
  participantQuizSchema
);

module.exports = ParticipantQuiz;
