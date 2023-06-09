"use strict";

const axios = require("axios");

/**
 *  genre controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::genre.genre", ({ strapi }) => ({
  import: async (ctx) => {
    const { data } = await axios.get(
      "https://core.bandas1album.com.br/wp-json/wp/v2/generos_album?per_page=99"
    );

    const genres = await Promise.all(
      data.map(
        (genre) =>
          new Promise(async (resolve, reject) => {
            const { name, description, id } = genre;

            try {
              const created = await strapi.entityService.create(
                "api::genre.genre",
                {
                  data: {
                    id: id,
                    title: name,
                    content: description,
                  },
                }
              );
              resolve(created);
            } catch {
              reject(err);
            }
          })
      )
    );

    ctx.send(genres);
  },
}));
