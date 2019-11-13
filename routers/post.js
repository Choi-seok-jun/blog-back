const express = require("express");
const router = express.Router();
const auth = require("../common/auth")();
const { Post, validatePost } = require("../models/post");
const { Tag } = require("../models/tag");
const wrapper = require("../common/wrapper");
//header에 토큰값을 넘겨주면
//auth.authenticate()얘가 알아서 분석해서 토큰에 담긴 유저정보를 그다음 req.user에다가 담아줌
//다음 함수 req에 쓸수있게 해줌
router.post(
  "/",
  auth.authenticate(),
  wrapper(async (req, res, next) => {
    if (!req.user.admin) {
      res.json({ error: "unauthorized" });
      next();
      return;
    }
    const { title, contents, tags } = req.body;
    if (validatePost(req.body).error) {
      res.status(400).json({ result: false, error: "양식에 맞지 않음" });
      next();
      return;
    }
    const post = new Post({
      title,
      auth: req.user.id,
      contents,
      tags
      //nodejs backend express 같은 태그들이 있을텐데 이이름이 아닌 아이디로
      //저장이 되있는데 그것들 다 돌면서 nodejs,backend,express 에 따로따로 아이디를 저장
    });
    await post.save();
    //여기까지가 포스트만 작성
    //이제부터는 tag에다가 업데이트!
    for (const tag_id of tags) {
      const tag = await Tag.findById(tag_id);
      tag.posts.push(post._id);
      await tag.save();
    }
    res.json({ result: true });
    next();
  })
);

module.exports = router;
