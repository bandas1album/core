module.exports = {
  routes: [
    {
      method: "GET",
      path: "/albums/import",
      handler: "album.import",
      config: {
        policies: [],
      },
    },
  ],
};
