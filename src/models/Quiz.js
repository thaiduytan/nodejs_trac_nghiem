const mongoose = require("mongoose");
var mongoose_delete = require("mongoose-delete");

const quizzSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    image: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"], // Đặt giá trị hợp lệ cho độ khó
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);
quizzSchema.plugin(mongoose_delete, { deletedAt: true });
const Quizz = mongoose.model("quizz", quizzSchema);

module.exports = Quizz;
