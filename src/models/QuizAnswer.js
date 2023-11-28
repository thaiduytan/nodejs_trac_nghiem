const mongoose = require("mongoose");
var mongoose_delete = require("mongoose-delete");

const quizAnswerSchema = new mongoose.Schema(
  {
    description: String,
    correct_answer: Boolean,
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quizQuestion",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

quizAnswerSchema.plugin(mongoose_delete, { deletedAt: true });
const QuizAnswer = mongoose.model("quizAnswer", quizAnswerSchema);

module.exports = QuizAnswer;
