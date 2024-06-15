const { parse } = require("pg-connection-string");
const { ssl } = require("pg/lib/defaults");

module.exports = ({ env }) => {
  const { host, port, database, user, password } = parse(env("DATABASE_URL"));

  return {
    connection: {
      client: "postgres",
      connection: {
        host,
        port,
        database,
        user,
        password,
        ssl: true,
      },
      debug: false,
    },
  };
};
