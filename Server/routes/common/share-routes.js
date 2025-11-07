const express = require("express");
const router = express.Router();
const { recordLinkShare } = require("../../controllers/common/share-controller"); 
const { optionalAuthMiddleware } = require("../../controllers/auth/auth-controller"); 

router.post("/record", optionalAuthMiddleware, recordLinkShare);

module.exports = router;