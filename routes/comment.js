const express = require("express");
const router = express.Router();

const db = require("../models");
const { QueryTypes } = require("sequelize");

// 댓글 전체 가져오기
router.get("/:board_seq", async (req, res) => {
  try {
    // 로그인 중인지 확인한다. => 차단 된 사람이면 return
    // 글번호 확인한다
    const { board_seq } = req.params;

    let sql =
      "SELECT * FROM `tb_comments` WHERE board_seq = ? ORDER_BY ins_dttm DESC";

    // db에서 카테고리 글을 불러온다
    const results = await db.sequelize.query(sql, {
      replacements: [board_seq],
      type: QueryTypes.SELECT,
    });

    if (results.length === 0) {
      return res
        .status(401)
        .json({ result: -1, data: null, err: "존재하지 않는 글번호 입니다." });
    }
    // 클라이언트로 데이터를 넘겨준다.
    res.status(200).json({ result: 1, data: results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ result: -100, data: null, err: "서버 에러 입니다" });
  }
});

// 댓글쓰기
router.post("/:board_seq", async (req, res) => {
  try {
    // 프론트에서 받은 데이터
    const { contents, writer } = req.body;
    const { board_seq } = req.params;
    // 데이터의 유효성을 확인한다.
    if (!contents || !writer) {
      return res
        .status(401)
        .json({ result: -1, data: null, err: "유효하지 않은 데이터 입니다." });
    }
    // 유저가 로그인 중인지 확인한다. -> 로그인 구현하면 확인

    // 디비에 넣어준다.
    const [results, metadata] = await db.sequelize.query(
      "INSERT INTO `tb_comments`(user_seq, board_seq, contents, writer) VALUES(1, ?, ?, ?)",
      {
        replacements: [board_seq, contents, writer],
        type: QueryTypes.INSERT,
      }
    );

    res.status(200).json({ result: 1, data: results });
    // 디비의 리턴값을 확인한다
    // 상태코드 혹은 데이터를 클라이언트에 리턴한다.
  } catch (e) {
    console.error(e);
    res.status(500).json({ result: -100, data: null, err: "서버 에러 입니다" });
  }
});

// 댓글수정
router.put("/:comment_seq", async (req, res) => {
  try {
    // 로그인 중인지 확인한다 -> 차단된 유저면 return
    // 로그인 중인 유저의 번호를 가져온다
    let user_seq = 1;
    const { comment_seq } = req.params;
    // 이 유저가 댓글쓴이인지 확인한다.
    let sql =
      "SELECT COUNT(*) as cnt FROM `tb_comments` WHERE AND user_seq = ? AND seq = ?";
    const [results] = await db.sequelize.query(sql, {
      replacements: [user_seq, comment_seq],
      type: QueryTypes.SELECT,
    });
    // 글쓴이가 맞으면 수정 아니면 return

    if (parseInt(results.cnt) > 0) {
      const { contents } = req.body;

      let sql = "UPDATE `tb_comments` SET contents = ? WHERE seq = ?";
      const [results, metadata] = await db.sequelize.query(sql, {
        replacements: [contents, comment_seq],
        type: QueryTypes.UPDATE,
      });

      res.status(200).json({ result: 1, data: results });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ result: -100, data: null, err: "서버 에러 입니다" });
  }
});

// 댓글삭제
router.delete("/:comment_seq", async (req, res) => {
  try {
    // 로그인 중인지 확인한다 -> 차단된 유저면 return
    // 로그인 중인 유저의 번호를 가져온다
    let user_seq = 1;
    const { board_seq, comment_seq } = req.params;
    // 이 유저가 댓글쓴이인지 확인한다.
    let sql =
      "SELECT COUNT(*) as cnt FROM `tb_comments` WHERE user_seq = ? AND seq = ?";
    const [results] = await db.sequelize.query(sql, {
      replacements: [user_seq, comment_seq],
      type: QueryTypes.SELECT,
    });
    // 글쓴이가 맞으면 삭제 아니면 return

    if (parseInt(results.cnt) > 0) {
      let sql = "UPDATE SET `tb_comments` state = 'N' WHERE seq = ?";
      const result = await db.sequelize.query(sql, {
        replacements: [comment_seq],
        type: QueryTypes.DELETE,
      });

      res.status(200).json({ result: 1, data: result });
    } else {
      res
        .status(401)
        .json({ result: -1, data: null, err: "존재하지 않는 댓글 입니다." });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ result: -100, data: null, err: "서버 에러 입니다" });
  }
});

module.exports = router;
