const express = require("express");
const { subscribeToNewsletter } = require("../../controllers/shop/newsletter-controller");

const router = express.Router();

router.post("/subscribe", subscribeToNewsletter);

module.exports = router;
