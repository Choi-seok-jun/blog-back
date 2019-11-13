const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User, validateUser } = require("../models/user");
const { jwtSecret } = require("../common/jwt_config");

router.post("/join", async (req, res, next) => {
  const { name, email, password } = req.body;
  if (validateUser(req.body).error) {
    //검증과정 통과 못하면
    res.status(400).json({ result: false });
    next();
    return;
  }
  const saltRound = 10;
  const hashedPW = await bcrypt.hash(password, saltRound);
  const user = new User({ name, email, password: hashedPW });
  const saveResult = await user.save();
  res.json({ result: true });
  next();
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    res.json({ result: false });
    next();
    return;
  }
  const result = await bcrypt.compare(password, user.password);
  //처음껀 입력한 비밀번호 , 2번째껀 DB에 들어있는 해쉬된 비밀번호 맞는것을 bcrypt가 비교해줌
  if (result) {
    //비밀번호가 맞는경우 토큰을 만들어줌!
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        admin: user.admin
      },
      jwtSecret,
      { expiresIn: "1m" }
    );
    res.json({ result: true, token, admin: user.admin });
    next();
  } else {
    res.json({ result: false });
    next();
  }
});

router.get("/email", async (req, res, next) => {
  const email = req.query.email;
  const user = await User.findOne({ email });
  if (user) {
    res.json({ result: false });
  } else {
    res.json({ result: true });
  }
  next();
});

module.exports = router;
