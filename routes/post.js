const express = require("express");
const router = express.Router();

// 전체 글 보기
router.get("/", (req, res) => {
  const board_data = [
    {
      category: "유머",
      title: "안녕하세요 스터디 이선영",
      date: "2021-12-26",
      like: 100,
      comment_count: 5,
    },
    {
      category: "이슈",
      title: "이슈이슈이슈이슈",
      date: "2021-12-27",
      like: 56,
      comment_count: 10,
    },
    {
      category: "공포/오컬트",
      title: "무시무시무시무시",
      date: "2021-12-25",
      like: 5,
      comment_count: 50,
    },
    {
      category: "정보",
      title: "와 정말 알고 싶던 정보였어요",
      date: "2021-12-24",
      like: 10,
      comment_count: 120,
    },
  ];
  res.status(200).json(board_data);
});

// 글 하나 보기
router.get("/:id", (req, res) => {
  res.send("글 하나 보기");
});

// 글쓰기
router.post("/", (req, res) => {
  res.send("글쓰기");
});

// 수정
router.put("/:id", (req, res) => {
  res.send("글 수정");
});

// 글삭제
router.delete("/:id", (req, res) => {
  res.send("글 삭제");
});

// 검색
router.get("/search/:search", (req, res) => {
  res.send("검색");
});

module.exports = router;
