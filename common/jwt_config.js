module.exports = {
  jwtSecret: process.env.TOKEN_KEY || "seokjun",
  jwtSession: {
    session: false
  }
};
