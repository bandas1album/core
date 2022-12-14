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
              id,
              title: { rendered: titleRendered },
              content: { rendered: contentRendered },
              date,
              images: { full: imageRendered },
              generos_album,
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
              const imageUrl = typeof imageRendered === 'boolean' ? 'http://dummyimage.com/400.jpg' : imageRendered;

              const downloaded = await strapi
                .service("api::album.download")
                .download(imageUrl);

              const [{ id: fileId }] = await strapi
                .service("api::album.upload")
                .upload(downloaded);

              const dateRendered = new Date(date);

              const country = await strapi.entityService.findMany(
                "api::country.country",
                {
                  filters: {
                    title: countryRendered,
                  },
                }
              );

              const created = await strapi.entityService.create(
                "api::album.album",
                {
                  data: {
                    id: id,
                    title: titleRendered,
                    content: contentRendered,
                    artist: artistRendered,
                    released: dateRendered
                      .toISOString()
                      .replace(/T.*/, "")
                      .split("-")
                      .join("-"),
                    cover: [fileId],
                    country: country[0].id,
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
                    genres: generos_album,
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
