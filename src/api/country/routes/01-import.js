module.exports = {
  routes: [
    {
      method: "GET",
      path: "/countries/import",
      handler: "country.import",
      config: {
        policies: [],
      },
    },
  ],
};
