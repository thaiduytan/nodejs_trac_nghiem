const fs = require("fs");
const mongoose = require("mongoose");
const Quizz = require("../models/Quiz");
const { uploadSingleFileAPI } = require("./uploadFileService");
const QuizQuestion = require("../models/QuizQuestion");
const QuizAnswer = require("../models/QuizAnswer");
const { convertObjectId } = require("./convertToValidObjectId");
const Participant = require("../models/Participant");
const ParticipantQuiz = require("../models/ParticipantQuiz");
const { extractToken, verifyToken } = require("../midleware/JWTAction");
const History = require("../models/History");
const { default: aqp } = require("api-query-params");

module.exports = {
  // Quiz
  createANewQuizService: async (req, imageUrl) => {
    const { description, name, difficulty } = req.body;
    const imageBuffer = fs.readFileSync(imageUrl.path);
    const imageBase64 = imageBuffer.toString("base64");

    if (!name || !difficulty) {
      return {
        DT: "",
        EM: "Invalid input",
        EC: -2,
      };
    }
    let result = await Quizz.create({
      name,
      description,
      image: imageBase64,
      difficulty,
    });
    return {
      DT: result,
      EC: 0,
      EM: "Create a new quiz succeed",
    };
  },
  getAllQuizForAdminService: async (req) => {
    if (req?.by === "all" || req?.by === "ALL") {
      const res = await Quizz.find({ deleted: false }).exec();
      return {
        DT: res,
        EC: 0,
        EM: "Get quizzes data succeed",
      };
    }
    // const res = await Quizz.find({ deleted: false }).exec();
  },
  putQuizAdminService: async (data, imageUrl) => {
    const { id, description, name, difficulty, quizImage } = data;
    let myQuiz = await Quizz.findOne({ _id: id });

    // return

    // check exsit Quiz
    if (!myQuiz) {
      return {
        DT: {
          name,
          description,
          difficulty,
          id,
        },
        EC: -1,
        EM: "Nothing to update",
      };
    }

    // ko dc xoa
    if (
      myQuiz._id === "652381ac401844f6eb13c6b2" ||
      myQuiz._id === "6523827a9a422317873049ce" ||
      myQuiz._id === "652385c2ec5e14fa847a6ac6"
    ) {
      return {
        DT: "",
        EC: -1,
        EM: "Không được phếp update Quiz mẫu này =_=",
      };
    }

    if (imageUrl) {
      const imageBuffer = fs.readFileSync(imageUrl.path);
      const imageBase64 = imageBuffer.toString("base64");

      await Quizz.updateOne(
        { _id: id },
        { name, description, difficulty, image: imageBase64 }
      );
    }

    // if (!quizImage) {
    //   await Participant.updateOne(
    //     { _id: id },
    //     { name, description, difficulty }
    //   );
    // }
    await Quizz.updateOne({ _id: id }, { name, description, difficulty });

    let newResult = {};
    newResult = {
      name: myQuiz?.name,
      description: myQuiz?.description,
      difficulty: myQuiz?.difficulty,
      id: myQuiz?._id,
    };
    return {
      DT: newResult,
      EC: 0,
      EM: "Update new quiz succeed",
    };
  },
  deleteQuizAdminService: async (quizId) => {
    const { id } = quizId;
    const myQuiz = await Quizz.findOne({ _id: id });

    // // ko dc xoa
    if (
      myQuiz._id === "652381ac401844f6eb13c6b2" ||
      myQuiz._id === "6523827a9a422317873049ce" ||
      myQuiz._id === "652385c2ec5e14fa847a6ac6"
    ) {
      return {
        DT: {
          id: myQuiz._id,
        },
        EC: -1,
        EM: "Xóa cái này lấy gì mà test @@",
      };
    }

    await Quizz.deleteById(id);
    return {
      DT: {
        id: id,
      },
      EC: 0,
      EM: "Delete the quiz succeed",
    };
  },
  getQuizWithQAService: async (quizId) => {
    const id = quizId;

    const questions = await QuizQuestion.find({ deleted: false, quiz_id: id })
      .populate("answers")
      .exec();

    for (let question of questions) {
      // Tìm tất cả các câu trả lời (answers) thuộc về câu hỏi này
      const answer = await QuizAnswer.find({
        deleted: false,
        question_id: question._id,
      }).exec();

      // Gán danh sách id vào trường 'answers' của câu hỏi
      question.answers = answer;

      // Lưu câu hỏi sau khi đã cập nhật trường 'answers'
      await question.save();
    }

    // Xây dựng mảng dữ liệu trả về theo định dạng
    const qa = questions.map((question) => ({
      id: question._id.toString(),
      description: question.description,
      imageFile: question.image ?? "",
      imageName: question.imageName ?? "",
      answers: question.answers.map((answer) => ({
        id: answer._id.toString(),
        description: answer.description,
        isCorrect: answer.correct_answer,
      })),
    }));

    return {
      DT: {
        quizId: id,
        qa: qa,
      },
      EC: 0,
      EM: "Get Quiz with Q/A succeed",
    };
  },
  postUpsertQAService: async (data) => {
    const { quizId, questions } = data;

    // console.log("postUpsertQAService: >>> data:", data);

    const listQuestionsCurrent = await QuizQuestion.find({ quiz_id: quizId });

    // Trường hợp 3: Đã có trong collection nhưng client đã xóa (fe) và Backend phải xóa theo phía client:
    const updatedQuestionIds = questions.map((q) => q.id);
    const updatedAnswerIds = questions
      .map((q) => {
        return q.answers.map((a) => a.id);
      })
      .flat();

    // 249- 271: tạo arr missing
    const missingQuestions = listQuestionsCurrent.filter((qo) => {
      return !updatedQuestionIds.includes(qo._id.toString());
    });

    const missingAnswers = (
      await Promise.all(
        listQuestionsCurrent.map(async (q, index) => {
          const listAnswersCurrent = await QuizAnswer.find({
            question_id: q.id,
          });

          let listMissingAnswers = listAnswersCurrent.filter((ao) => {
            return !updatedAnswerIds.includes(ao._id.toString());
          });

          // console.log("m >>> m:", index, listMissingAnswers);

          return listMissingAnswers;
        })
      )
    ).flat();

    // xóa missingQuestions
    if (missingQuestions) {
      for (var i = 0; i < missingQuestions.length; i++) {
        const idQuesiton = missingQuestions[i]._id.toString();
        await QuizQuestion.deleteById(idQuesiton);
        // await QuizQuestion.save();
      }
    }
    // xóa missingAnswers
    if (missingAnswers) {
      for (var i = 0; i < missingAnswers.length; i++) {
        const idAnswers = missingAnswers[i]._id.toString();
        await QuizAnswer.deleteById(idAnswers);
        // await QuizAnswer.save();
      }
    }

    // Trường hợp 1: Đã có và cập nhật lại:
    // Trường hợp 2: Chưa có, tạo mới:
    for (const questionData of questions) {
      const { id, description, imageFile, imageName, answers } = questionData;

      // console.log("postUpsertQAService: >>> imageFile:", imageFile);

      // Chuyển đổi chuỗi thành đối tượng ObjectId
      const convertedObjectId = convertObjectId(id);

      // Dữ liệu mới bạn muốn upsert
      const newQuestionData = {
        description,
        image: imageFile,
        imageName,
        quiz_id: quizId,
        answers: [],
      };
      // console.log("postUpsertQAService: >>> id:", id);
      // Tìm câu hỏi dựa trên id hoặc tạo mới nếu không tồn tại
      const question = await QuizQuestion.findOneAndUpdate(
        { _id: convertedObjectId },
        { $set: newQuestionData }, // Sử dụng $set để chỉ cập nhật các trường mà bạn muốn cập nhật
        { upsert: true, new: true }
      );

      for (const answerData of answers) {
        const { id, description, isCorrect } = answerData;

        // Chuyển đổi chuỗi thành đối tượng ObjectId
        const convertedObjectId = convertObjectId(id);

        // Dữ liệu mới bạn muốn upsert
        const newAnswerdata = {
          description,
          correct_answer: isCorrect,
          question_id: question._id,
        };

        // Tìm câu trả lời dựa trên id hoặc tạo mới nếu không tồn tại
        const answer = await QuizAnswer.findOneAndUpdate(
          { _id: convertedObjectId },
          { $set: newAnswerdata }, // Sử dụng $set để chỉ cập nhật các trường mà bạn muốn cập nhật
          { upsert: true, new: true }
        );

        // push  answers: [] to question
        question.answers.push(answer._id);

        // Lưu lại câu hỏi sau khi đã cập nhật trường answers
        await answer.save();
      }

      // Lưu lại câu hỏi sau khi đã cập nhật trường answers
      await question.save();
    }

    // for (const questionData of questions) {
    //   // console.log("postUpsertQAService: >>> questionData:", questionData);

    //   const { id, description, imageFile, imageName, answers } = questionData;

    //   // Chuyển đổi chuỗi thành đối tượng ObjectId
    //   const objectId = mongoose.Types.ObjectId(id);

    //   // Dữ liệu mới bạn muốn upsert
    //   const newQuestionData = {
    //     description,
    //     image: imageFile,
    //     imageName,
    //     quiz_id: quizId,
    //     answers: [],
    //   };

    //   // Kiểm tra xem câu hỏi có tồn tại không
    //   const existingQuestion = await QuizQuestion.findOne({ _id: objectId });

    //   if (existingQuestion) {
    //     console.log("da ton tai");
    //   } else {
    //     console.log("chua ton tai");
    //     const question = new QuizQuestion(newQuestionData);
    //     for (const answerData of answers) {
    //       // create new answer
    //       const { id, description, isCorrect } = answerData;
    //       const answer = new QuizAnswer({
    //         description,
    //         correct_answer: isCorrect,
    //         question_id: question._id,
    //       });

    //       // push  answers: [] to question
    //       question.answers.push(answer._id);

    //       await answer.save();
    //     }
    //     await question.save();
    //   }

    // }

    return {
      DT: listQuestionsCurrent,
      EC: 0,
      EM: "Update questions succeed",
    };
  },
  assignQuizToUserService: async (data) => {
    const { quizId, userId } = data;

    // console.log("assignQuizToUserService: >>> userId:", userId);
    // console.log("assignQuizToUserService: >>> quizId:", quizId);

    const isExsitQuiz = await Quizz.findById(quizId);
    const isExsitUser = await Participant.findById(userId);

    if (!isExsitQuiz || !isExsitUser) {
      return {
        DT: "",
        EM: "Quiz hoặc User is not aleary exsit.",
        EC: -2,
      };
    }

    const isAssignToUser = await ParticipantQuiz.findOne({
      participant_id: userId,
      quiz_id: quizId,
    });

    if (isAssignToUser) {
      return {
        DT: {
          quizId,
          userId,
        },
        EC: -1,
        EM: "The quiz already assigned to the user",
      };
    }

    const res = await ParticipantQuiz.create({
      participant_id: userId,
      quiz_id: quizId,
      isFinish: false,
    });

    return {
      DT: {
        quizId: res.quiz_id,
        userId: res.participant_id,
      },
      EC: 0,
      EM: "Assign the quiz to the current user succeed",
    };
  },
  getAllParticipantService: async () => {
    const res = await Participant.find({ deleted: false }).exec();
    return {
      DT: res,
      EC: 0,
      EM: "Get Participant data succeed",
    };
  },
  // Question
  createANewQuestionService: async (req, imageUrl) => {
    // console.log("createANewQuestionService: >>> imageUrl:", imageUrl);

    const { quiz_id, description } = req.body;
    let result;

    if (imageUrl) {
      const imageBuffer = fs.readFileSync(imageUrl.path);
      const imageBase64 = imageBuffer.toString("base64");
      result = await QuizQuestion.create({
        quiz_id,
        description,
        image: imageBase64,
      });
      return {
        DT: result,
        EC: 0,
        EM: "Create a new question succeed",
      };
    }

    if (!description || !quiz_id) {
      return {
        DT: "",
        EM: "Invalid input",
        EC: -2,
      };
    }
    let isExsitQuiz = await Quizz.findById(quiz_id);
    if (!isExsitQuiz) {
      return {
        DT: "",
        EC: 0,
        EM: "Quiz is not already",
      };
    }

    result = await QuizQuestion.create({
      quiz_id,
      description,
      image: "",
    });

    return {
      DT: result,
      EC: 0,
      EM: "Create a new question succeed",
    };
  },
  // Answer
  createANewAnswerService: async (req) => {
    const { description, correct_answer, question_id } = req.body;
    let isExsitQuestion = await QuizQuestion.findById(question_id);
    if (!isExsitQuestion) {
      return {
        DT: "",
        EC: 0,
        EM: "Question is not already",
      };
    }

    if (!description || !question_id) {
      return {
        DT: "",
        EM: "Invalid input",
        EC: -2,
      };
    }

    let result = await QuizAnswer.create({
      description,
      correct_answer,
      question_id,
    });

    return {
      DT: result,
      EC: 0,
      EM: "Create a new question succeed",
    };
  },

  dashBoardOverViewService: async (req) => {
    const token = extractToken(req);
    const infoPaticipant = verifyToken(token);

    // check Role
    if (infoPaticipant.role !== "ADMIN") {
      return {
        DT: "",
        EC: 0,
        EM: "Get Dashboard Overview faled",
      };
    }

    // users
    const total = await Participant.find({}).exec();
    const users = await Participant.find({ role: "USER" }).exec();
    const admins = await Participant.find({ role: "ADMIN" }).exec();

    // others
    const quiz = await Quizz.find({}).exec();
    const questions = await QuizQuestion.find({}).exec();
    const answer = await QuizAnswer.find({}).exec();

    return {
      DT: {
        users: {
          total: total.length,
          countUsers: users.length,
          countAdmin: admins.length,
        },
        others: {
          countQuiz: quiz.length,
          countQuestions: questions.length,
          countAnswers: answer.length,
        },
      },
      EC: 0,
      EM: "Get Dashboard Overview succeed",
    };
  },

  getHistoryForAdminService: async (queryString) => {
    // console.log(queryString);
    let page = queryString.page;
    const { limit, filter } = aqp(queryString);
    delete filter.page; // xoa page
    let skip = (page - 1) * limit;

    // Truy vấn tổng số lượng dữ liệu
    const totalCount = await History.countDocuments({});
    // Tính totalPages dựa trên totalCount và limit
    const totalPages = Math.ceil(totalCount / limit);

    const myHistory = await History.find({ ...filter })
      .limit(limit)
      .skip(skip)
      .exec();

    const result = await Promise.all(
      myHistory.map(async (history) => {
        const infoQuiz = await Quizz.findById(history.quiz_id).exec();
        const infoUser = await Participant.findById(
          history.participant_id
        ).exec();
        return {
          id: history._id,
          email: infoUser.email,
          name: infoUser.username,
          quiz_id: history.quiz_id,
          total_questions: history.totalQuestions,
          total_correct: history.totalCorrect,
          createdAt: history.createdAt,
          updatedAt: history.updatedAt,
          quizHistory: {
            id: infoQuiz._id,
            name: infoQuiz.name,
            description: infoQuiz.description,
          },
        };
      })
    );

    return {
      DT: {
        data: result,
        totalCount,
        totalPages,
      },
      EC: 0,
      EM: "Get History succeed",
    };
  },
};
