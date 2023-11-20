const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("./keys");
const { pool } = require("../dbInstance");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        pool.query(`SELECT * FROM users WHERE uin='${jwt_payload.uin}'`, (err, result) => {
            if(err){
                console.log(err);
            }
            if(result.rows.length > 0){
                return done(null, result.rows[0]);
            }
            return done(null,false);
        })
    })
  );
};
