const express = require("express");
const {
  registerForDebate,
} = require("../../controllers/shop/debate-controller");

const router = express.Router();

router.post("/register", registerForDebate);

module.exports = router;
