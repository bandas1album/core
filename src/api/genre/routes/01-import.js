module.exports = {
  routes: [
    {
      method: "GET",
      path: "/genres/import",
      handler: "genre.import",
      config: {
        policies: [],
      },
    },
  ],
};
