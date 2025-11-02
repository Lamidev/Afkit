const express = require("express");
const router = express.Router();
const { recordLinkShare } = require("../../controllers/common/share-controller"); // Adjust path as needed
const { optionalAuthMiddleware } = require("../../controllers/auth/auth-controller"); // Assuming optionalAuthMiddleware path

router.post("/record", optionalAuthMiddleware, recordLinkShare);

module.exports = router;