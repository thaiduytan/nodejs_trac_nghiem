const { verifyToken, extractToken } = require("../midleware/JWTAction");
const History = require("../models/History");
const ParticipantQuiz = require("../models/ParticipantQuiz");
const Quizz = require("../models/Quiz");
const QuizAnswer = require("../models/QuizAnswer");
const QuizQuestion = require("../models/QuizQuestion");

module.exports = {
  getAllQuizByParticipantService: async (req) => {
    const token = extractToken(req);
    const infoPaticipant = verifyToken(token);
    let listQuiz = [];

    let result = [];
    // let participantQuiz = await ParticipantQuiz.find({
    //   participant_id: infoPaticipant.id,
    // })
    //   .select("-_id")
    //   .lean(); // Loại bỏ trường _id từ kết quả
    let participantQuiz = await ParticipantQuiz.find({
      participant_id: infoPaticipant.id,
    })
      .select("-_id")
      .lean(); // Loại bỏ trường _id từ kết quả

    // console.log(
    //   "getAllQuizByParticipantService: >>> participantQuiz:",
    //   participantQuiz
    // );

    for (let i = 0; i < participantQuiz.length; i++) {
      let quiz = await Quizz.findOne({
        _id: participantQuiz[i].quiz_id.toString(),
      });

      // console.log("getAllQuizByParticipantService: >>> quiz:", quiz);

      listQuiz.push(quiz);
    }
    result = listQuiz.map((quiz) => {
      const detail = participantQuiz.find(
        (item) => item.quiz_id.toString() === quiz._id.toString()
      );
      return {
        id: quiz._id,
        description: quiz.description,
        image: quiz.image,
        name: quiz.name,
        ParticipantQuiz: detail,
      };
    });
    return {
      DT: result,
      EC: 0,
      EM: "get Quiz By Participant succeed",
    };
  },
  getQuestionByIdQuizService: async (req) => {
    const quizId = req.query.quizId;
    let result = [];
    let questionAnswer = {};
    const questions = await QuizQuestion.find({
      quiz_id: quizId,
    }).exec();
    for (let i = 0; i < questions.length; i++) {
      let answers = await QuizAnswer.find({
        deleted: false,
        question_id: questions[i]._id.toString(),
      });
      for (let j = 0; j < answers.length; j++) {
        questionAnswer = {
          id: questions[i]._id,
          description: questions[i].description,
          image: questions[i].image,
          answers: {
            id: answers[j]._id,
            description: answers[j].description,
          },
        };
        result.push(questionAnswer);
      }
    }

    return {
      DT: result,
      EC: 0,
      EM: "Get Questions and Answers By Quiz succeed",
    };
  },
  postQuizSubmitService: async (req) => {
    const token = extractToken(req);
    const infoPaticipant = verifyToken(token);
    const idQuiz = await ParticipantQuiz.findOne({
      participant_id: infoPaticipant.id,
    }).exec();

    let bodyJson = req.body;
    let listAnswers = bodyJson.answers;
    let userAnswerId = [];
    let userAnswerIdNested = [];
    let userQuestion = [];
    let quizData = [];
    let resultCount = {
      countCorrect: 0,
      countTotal: listAnswers.length,
    };
    // ----------------------count countCorrect and countTotal -------------------
    listAnswers.forEach((answer) => {
      if (answer.userAnswerId.length < 2) {
        answer.userAnswerId.forEach((id) => {
          userAnswerId.push([id]);
        });
      }
      answer.userAnswerId.forEach((id) => {
        userAnswerId.push([id]);
      });
    });

    const userCorrectAnswer = await QuizAnswer.find({
      _id: { $in: userAnswerId },
      correct_answer: true,
    }).exec();
    if (userCorrectAnswer) {
      resultCount.countCorrect = userCorrectAnswer.length;
    }
    // ----------------------count countCorrect and countTotal -------------------

    listAnswers.forEach((answer) => {
      if (answer.userAnswerId.length != 0) {
        userQuestion.push(answer.questionId);
      }
    });
    const listTheQuestionHasBeenAnswered = await QuizQuestion.find({
      _id: { $in: userQuestion },
    }).exec();
    const listCorrectAnswer = await QuizAnswer.find({
      correct_answer: true,
    }).exec();
    for (let i = 0; i < listAnswers.length; i++) {
      userAnswerIdNested.push(listAnswers[i].userAnswerId);
    }
    quizData = listTheQuestionHasBeenAnswered.map((questionAnswered, index) => {
      let isCorrect = false;
      userCorrectAnswer.forEach((item) => {
        if (item.question_id.toString() === questionAnswered._id.toString()) {
          isCorrect = true;
        }
      });

      let systemAnswers = listCorrectAnswer.filter((answer) => {
        return (
          answer.question_id.toString() === questionAnswered._id.toString()
        );
      });
      return {
        questionId: questionAnswered._id,
        isCorrect: isCorrect,
        userAnswers: userAnswerIdNested[index],
        systemAnswers: systemAnswers,
      };
    });

    // Create History
    await History.create({
      participant_id: infoPaticipant.id,
      quiz_id: idQuiz.quiz_id,
      totalQuestions: resultCount.countTotal,
      totalCorrect: resultCount.countCorrect,
    });

    return {
      DT: {
        quizData: quizData,
        countCorrect: resultCount.countCorrect,
        countTotal: resultCount.countTotal,
      },
      EC: 0,
      EM: "Submit the quiz succeed",
    };
  },
};
