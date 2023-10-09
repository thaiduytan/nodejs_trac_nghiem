const mongoose = require("mongoose");

const quizQuestionSchema = new mongoose.Schema(
  {
    // id
    description: String,
    image: String,
    quiz_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quizz",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const QuizQuestion = mongoose.model("quizQuestion", quizQuestionSchema);

module.exports = QuizQuestion;
