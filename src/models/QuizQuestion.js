const mongoose = require("mongoose");
var mongoose_delete = require("mongoose-delete");

const quizQuestionSchema = new mongoose.Schema(
  {
    // id
    description: String,
    image: String,
    quiz_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quizz",
    },
    answers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quizAnswer", // Tham chiếu đến collection "Answer"
      },
    ],
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);
quizQuestionSchema.plugin(mongoose_delete, { deletedAt: true });
const QuizQuestion = mongoose.model("quizQuestion", quizQuestionSchema);

module.exports = QuizQuestion;
