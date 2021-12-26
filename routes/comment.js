const express = require("express");
const router = express.Router();

// 댓글 전체 가져오기
router.get("/:postId", (req, res) => {
  res.send("댓글 전체 가져오기");
});

// 댓글쓰기
router.post("/", (req, res) => {
  res.send("댓글쓰기");
});

// 댓글수정
router.put("/:id", (req, res) => {
  res.send("댓글수정");
});

// 댓글삭제
router.delete("/:id", (req, res) => {
  res.send("댓글삭제");
});

module.exports = router;
