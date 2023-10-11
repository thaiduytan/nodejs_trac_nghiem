const {
  getParticipantService,
  createParticipantService,
} = require("../services/participantService");
const { uploadSingleFileAPI } = require("../services/uploadFileService");

module.exports = {
  getAllParticipant: async (req, res) => {
    try {
      const participants = await getParticipantService(req.query);
      return res.status(200).json({
        DT: {
          totalRows: participants.totalCount,
          totalPages: participants.totalPages,
          users: participants.newResult,
        },
        EC: 0,
        EM: "Get list participants succeed",
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Error from sever",
        EC: "-1",
        DT: "",
      });
    }
  },

  postCreateParticipant: async (req, res) => {
    try {
      let imageUrl = "";
      if (req.files) {
        imageUrl = await uploadSingleFileAPI(req.files.userImage);
      }
      const result = await createParticipantService(req.body, imageUrl, res);
      const { EC } = result;
      if (EC === -1) {
        return res.status(400).json({
          DT: "",
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
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  putParticipant: (req, res) => {},
  deleteParticipant: (req, res) => {},
};
