module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'bbc00eb1a31454fa3ccfe0d7726360fb'),
  },
});
