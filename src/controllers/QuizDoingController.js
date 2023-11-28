const {
  getAllQuizByParticipantService,
  getQuestionByIdQuizService,
  postQuizSubmitService,
} = require("../services/quizDoingService");

module.exports = {
  getAllQuizByParticipant: async (req, res) => {
    try {
      const quiz = await getAllQuizByParticipantService(req);

      return res.status(200).json({
        DT: quiz.DT,
        EC: quiz.EC,
        EM: quiz.EM,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  },
  getQuestionByIdQuiz: async (req, res) => {
    try {
      // console.log(req.params.quizId);
      const questionAnswers = await getQuestionByIdQuizService(req);
      // return res.send("ho thu")
      return res.status(200).json({
        DT: questionAnswers.DT,
        EC: questionAnswers.EC,
        EM: questionAnswers.EM,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  },
  postQuizSubmit: async (req, res) => {
    try {
      const submitAnswers = await postQuizSubmitService(req);
      // res.send("ok");
      return res.status(200).json({
        DT: submitAnswers.DT,
        EC: submitAnswers.EC,
        EM: submitAnswers.EM,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  },
};
