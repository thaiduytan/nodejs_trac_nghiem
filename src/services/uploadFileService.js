const path = require("path"); // or fs; file system

module.exports = {
  uploadSingleFileAPI: async (fileObject, nameFolder = "participant") => {
    let uploadPath = path.resolve(__dirname, `../public/images/${nameFolder}`);
    let extName = path.extname(fileObject.name); // get image extension
    let baseName = path.basename(fileObject.name, extName); //get images name
    let finalName = `${baseName}-${Date.now()}${extName}`;
    let finalPath = `${uploadPath}/${finalName}`;
    // cofige static file public images/css/js
    try {
      await fileObject.mv(finalPath);
      return {
        status: "sucess",
        name: finalName,
        path: finalPath,
        error: null,
      };
    } catch (error) {
      return { status: "failed", path: null, error: JSON.stringify(error) };
    }
  },
};
