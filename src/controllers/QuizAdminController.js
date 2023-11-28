const {
  createANewQuizService,
  putQuizAdminService,
  deleteQuizAdminService,
  createANewQuestionService,
  createANewAnswerService,
  getQuizWithQAService,
  postUpsertQAService,
  assignQuizToUserService,
  getAllQuizForAdminService,
  getAllParticipantService,
  dashBoardOverViewService,
  getHistoryForAdminService,
} = require("../services/quizAdminService");
const { uploadSingleFileAPI } = require("../services/uploadFileService");

module.exports = {
  // quiz
  createANewQuiz: async (req, res) => {
    try {
      let imageUrl = "";
      if (req.files) {
        imageUrl = await uploadSingleFileAPI(req.files.quizImage, "quiz");

        const newQuiz = await createANewQuizService(req, imageUrl);
        return res.status(200).json({
          DT: newQuiz.DT,
          EC: newQuiz.EC,
          EM: newQuiz.EM,
        });
      } else {
        return res.status(400).json({
          DT: "",
          EM: "No files were uploaded.",
          EC: -1,
        });
      }
    } catch (error) {
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  },
  getAllQuizForAdmin: async (req, res) => {
    try {
      const allQuiz = await getAllQuizForAdminService(req.params);
      // res.send("ok")
      return res.status(200).json({
        DT: allQuiz.DT,
        EC: allQuiz.EC,
        EM: allQuiz.EM,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  },
  putQuizAdmin: async (req, res) => {
    try {
      let imageUrl = "";
      if (req.files) {
        imageUrl = await uploadSingleFileAPI(req.files.quizImage, "quiz");
      }

      const updateQuiz = await putQuizAdminService(req.body, imageUrl);
      // res.send("ok")
      return res.status(200).json({
        DT: updateQuiz.DT,
        EC: updateQuiz.EC,
        EM: updateQuiz.EM,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  },
  deleteQuizAdmin: async (req, res) => {
    // console.log(req.params.id);
    // return res.send("pk")
    try {
      let result = await deleteQuizAdminService(req.params);
      const { EC } = result;
      if (EC === -1) {
        return res.status(200).json({
          DT: result.DT,
          EC: result.EC,
          EM: result.EM,
        });
      }
      return res.status(200).json({
        DT: result.DT,
        EC: result.EC,
        EM: result.EM,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  },
  getQuizWithQA: async (req, res) => {
    try {
      const result = await getQuizWithQAService(req.params.id);
      // return res.send("ok");
      return res.status(200).json({
        DT: result.DT,
        EC: result.EC,
        EM: result.EM,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  },
  postUpsertQA: async (req, res) => {
    try {
      // console.log(req.body);
      const upsertQA = await postUpsertQAService(req.body);
      // res.send("ok");
      return res.status(200).json({
        DT: upsertQA.DT,
        EC: upsertQA.EC,
        EM: upsertQA.EM,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  },
  assignQuizToUser: async (req, res) => {
    try {
      const assign = await assignQuizToUserService(req.body);
      // res.send("ok");
      return res.status(200).json({
        DT: assign.DT,
        EC: assign.EC,
        EM: assign.EM,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  },
  getAllParticipant: async (req, res) => {
    try {
      const allParticipant = await getAllParticipantService();
      // res.send("ok")
      return res.status(200).json({
        DT: allParticipant.DT,
        EC: allParticipant.EC,
        EM: allParticipant.EM,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  },
  // question
  createANewQuestion: async (req, res) => {
    try {
      let imageUrl = "";
      if (req.files) {
        console.log("ok");
        imageUrl = await uploadSingleFileAPI(
          req.files.questionImage,
          "question"
        );
      }
      const newQuestion = await createANewQuestionService(req, imageUrl);
      // return res.send(200)
      return res.status(200).json({
        DT: newQuestion.DT,
        EC: newQuestion.EC,
        EM: newQuestion.EM,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  },
  createANewAnswer: async (req, res) => {
    try {
      const newAnswer = await createANewAnswerService(req);
      // return res.send(200)
      return res.status(200).json({
        DT: newAnswer.DT,
        EC: newAnswer.EC,
        EM: newAnswer.EM,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  },

  // dashboardOverviewForAdmin
  dashBoardOverviewForAdmin: async (req,res) => {
    try {
      const overView = await dashBoardOverViewService(req);
      // return res.send(200)
      return res.status(200).json({
        DT: overView.DT,
        EC: overView.EC,
        EM: overView.EM,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  },
  getHistoryForAdmin: async (req,res) => {
    try {
      const allHistory = await getHistoryForAdminService(req.query);
      // return res.send(200)
      return res.status(200).json({
        DT: allHistory.DT,
        EC: allHistory.EC,
        EM: allHistory.EM,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  }
};
