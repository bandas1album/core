module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', ('b9Bm7E2UcN4OEjo9kOVFBQ==','/TDo7tdKJHt3w7lxrs/CYQ==','wo8CBj9I4gmyWp61zIrEVw==','YH0A2UCwhir293Kg5Xo4ug==')),
  },
});
