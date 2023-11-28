const mongoose = require("mongoose");

const participantQuizSchema = new mongoose.Schema(
  {
    // participant_id: [
    //   { type: mongoose.Schema.Types.ObjectId, ref: "participant" },
    // ],
    // quiz_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "quizz" }],
    participant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "participant",
    },
    quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: "quizz" },
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

// Middleware to set default values for timeStart and timeEnd if not provided
// https://mongoosejs.com/docs/middleware.html
participantQuizSchema.pre("save", function (next) {
  // do stuff
  const currentDate = new Date();

  if (!this.timeStart) {
    this.timeStart = currentDate;
  }
  if (!this.timeEnd) {
    this.timeEnd = currentDate;
  }

  next();
});

const ParticipantQuiz = mongoose.model(
  "participantQuiz",
  participantQuizSchema
);

module.exports = ParticipantQuiz;
