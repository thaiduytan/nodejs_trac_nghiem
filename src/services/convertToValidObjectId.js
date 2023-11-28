const mongoose = require("mongoose");
module.exports = {
  convertObjectId: (id) => {
    const isValidObjectId = (checkId) => {
      return typeof checkId === "string" && /^[0-9a-fA-F]{24}$/.test(checkId);
    };

    if (isValidObjectId(id)) {
      return id;
    }
// c1b9a5e0-2e9c-4c32-aaae-6d77e1e13f8d
    // Nếu không hợp lệ, chuyển đổi thành hex 24 ký tự ngẫu nhiên hoặc thực hiện quy trình chuyển đổi phù hợp với yêu cầu của bạn.
    return mongoose.Types.ObjectId().toHexString();
  },
};
