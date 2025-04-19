const express = require("express");
const { registerUser, authUser, allUsers, oneUser } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.route("/getuser/:email").get(oneUser);
router.route("/login").post(authUser);

module.exports = router;