const mongoose = require("mongoose");

const quizParticipantAnswerSchema = new mongoose.Schema(
  {
    participant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "participantQuiz",
    },
    quiz_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quizz",
    },
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quizQuestion",
    },
    user_answers: String,
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const QuizParticipantAnswer = mongoose.model(
  "quizParticipantAnswer",
  quizParticipantAnswerSchema
);

module.exports = QuizParticipantAnswer;
