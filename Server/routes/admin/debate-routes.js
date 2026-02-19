const express = require("express");
const {
  getAllDebateRegistrations,
  deleteDebateRegistration,
} = require("../../controllers/shop/debate-controller");

const router = express.Router();

router.get("/registrations", getAllDebateRegistrations);
router.delete("/delete/:id", deleteDebateRegistration);

module.exports = router;
