const {
  getParticipantService,
  createParticipantService,
  updateParticipantService,
  deleteParticipantService,
  updateProfileService,
  changePasswordService,
  getHistoryService,
} = require("../services/participantService");
const { uploadSingleFileAPI } = require("../services/uploadFileService");

module.exports = {
  getParticipant: async (req, res) => {
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

  putParticipant: async (req, res) => {
    // console.log(req.body);
    // res.send("ok");
    try {
      let imageUrl = "";
      if (req.files) {
        imageUrl = await uploadSingleFileAPI(req.files.userImage);
      }
      const result = await updateParticipantService(req.body, imageUrl, res);
      return res.status(200).json({
        DT: result.DT,
        EC: result.EC,
        EM: result.EM,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteParticipant: async (req, res) => {
    try {
      let result = await deleteParticipantService(req.body);
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
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updateProfile: async (req, res) => {
    try {
      let imageUrl = "";
      if (req.files) {
        imageUrl = await uploadSingleFileAPI(
          req.files.userImage,
          "paticipantUpdate"
        );
      }
      // console.log("updateProfile: >>> imageUrl:", imageUrl);
      const result = await updateProfileService(req, req.body, imageUrl);
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
      // res.send("ok");
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  changePassword: async (req, res) => {
    try {
      const result = await changePasswordService(req.body, req);
      // res.send("ok");
      return res.status(200).json({
        DT: result.DT,
        EC: result.EC,
        EM: result.EM,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getHistory: async (req, res) => {
    try {
      const result = await getHistoryService(req);
      // res.send("ok");
      return res.status(200).json({
        DT: result.DT,
        EC: result.EC,
        EM: result.EM,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
