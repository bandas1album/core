"use strict";

/**
 *  album controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const axios = require("axios");
const fs = require("fs").promises;

module.exports = createCoreController("api::album.album", ({ strapi }) => ({
  import: async (ctx) => {
    const { data } = await axios.get(
      "https://core.bandas1album.com.br/wp-json/wp/v2/album?per_page=99&page=4"
    );
    const albums = await Promise.all(
      data.map(
        (album) =>
          new Promise(async (resolve, reject) => {
            const {
              title: { rendered: titleRendered },
              content: { rendered: contentRendered },
              date,
              images: { full: imageRendered },
              acf: {
                artist: artistRendered,
                released: releasedRendered,
                country: countryRendered,
                label: labelRendered,
                amazon: amazonRendered,
                deezer: deezerRendered,
                lastfm: lastfmRendered,
                spotify: spotifyRendered,
                wikipedia: wikipediaRendered,
                download: downloadRendered,
                tracklist: tracklistRendered,
              },
            } = album;

            try {
              const downloaded = await strapi
                .service("api::album.download")
                .download(imageRendered);

              const [{ id: fileId }] = await strapi
                .service("api::album.upload")
                .upload(downloaded);

              const dateRendered = new Date(date);

              const created = await strapi.entityService.create(
                "api::album.album",
                {
                  data: {
                    title: titleRendered,
                    content: contentRendered,
                    artist: artistRendered,
                    released: dateRendered
                      .toISOString()
                      .replace(/T.*/, "")
                      .split("-")
                      .join("-"),
                    cover: [fileId],
                    country: countryRendered,
                    label: labelRendered,
                    social: {
                      amazon: amazonRendered,
                      deezer: deezerRendered,
                      lastfm: lastfmRendered,
                      spotify: spotifyRendered,
                      wikipedia: wikipediaRendered,
                      download: downloadRendered,
                    },
                    tracklist: tracklistRendered,
                  },
                }
              );
              resolve(created);
            } catch (err) {
              reject(err);
            }
          })
      )
    );

    ctx.send(albums);
  },
}));
