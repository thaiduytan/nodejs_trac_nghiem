const mongoose = require("mongoose");

const quizAmswerSchema = new mongoose.Schema(
  {
    description: String,
    correct_answer: String,
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quizQuestion",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const QuizAmswer = mongoose.model("quizAmswer", quizAmswerSchema);

module.exports = QuizAmswer;
