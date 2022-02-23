const router = require("express").Router();
const authenticate = require("../../../middlewares/authentication.middleware");
const authController = require("./auth.controller");

router.post("/request-otp", authController.requestOTP);
router.post("/validate-otp", authController.validateOTP);
router.post(
  "/sound-generate-token",
  authenticate,
  authController.generateAuthSoundToken
);
router.post(
  "/sound-validate-token",
  authController.verifyAuthSoundToken
);
router.get(
  "/profile",
  authenticate,
  authController.profile
);
module.exports = router;
