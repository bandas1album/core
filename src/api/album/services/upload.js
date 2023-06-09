"use strict";

const path = require("path");
const fs = require("fs").promises;

/**
 * upload service.
 */

module.exports = {
  upload: async (imgPath) => {
    const buffer = await fs.readFile(imgPath);
    const name = path.basename(imgPath);
    const ext = path.extname(imgPath).slice(1);

    return await strapi.plugins.upload.services.upload.upload({
      data: {},
      files: {
        path: imgPath,
        name: name,
        type: `image/${ext}`, // mime type of the file
        size: buffer.toString().length,
      },
    });
  },
};
