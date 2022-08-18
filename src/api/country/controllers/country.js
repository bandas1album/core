"use strict";

/**
 *  country controller
 */

const axios = require("axios");
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::country.country", ({ strapi }) => ({
  import: async (ctx) => {
    const { data } = await axios.get(
      "https://core.bandas1album.com.br/wp-json/wp/v2/album?per_page=99&page=4"
    );
    const albums = [];

    for await (let album of data) {
      await new Promise(async (resolve, reject) => {
        const {
          acf: { country: countryRendered },
        } = album;

        try {
          const entriesCountries = await strapi.entityService.findMany(
            "api::country.country",
            {
              filters: {
                title: countryRendered,
              },
            }
          );
          const found = entriesCountries.find(
            (item) => item.title == countryRendered
          );

          if (!found) {
            const created = await strapi.entityService.create(
              "api::country.country",
              {
                data: {
                  title: countryRendered,
                },
              }
            );

            albums.push(created);
            resolve(created);
          }

          resolve();
        } catch (err) {
          reject(err);
        }
      });
    }

    ctx.send(albums);
  },
}));
