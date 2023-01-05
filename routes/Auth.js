const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// middlewares
const {
  hashPassword,
  verifyPassword,
  verifyToken,
} = require("./../middlewares/authenticated");
// models
const User = require("./../models/User");
// config
const { config } = require("./../config");

router.post("/login", async (req, res, next) => {
  try {
    const { body } = req;
    const { username, password } = body;
    console.log("BODY", body);

    // find user by username
    const userFound = await User.findOne({ username });
    if (!userFound) {
      throw new Error("User not found");
    }
    // validate password
    const passwordCorrect = await verifyPassword(password, userFound.password);
    if (!passwordCorrect) {
      throw new Error("Incorrect password");
    }

    // create token
    const token = await jwt.sign(
      { id: userFound.id, username: userFound.username },
      config.jwtSecret,
      { expiresIn: "1h" }
    );
    res.json({ data: { token } });
  } catch (error) {
    next(error);
  }
});

// update password
router.patch("/change-password", verifyToken, async (req, res, next) => {
  try {
    const { body, user } = req;
    const { oldPassword, newPassword } = body;
    console.log("BODY", body);
    console.log("AUTHENTICATED", user);

    const userFound = await User.findById(user.id);
    if (!userFound) {
      throw new Error("User not found");
    }
    const passwordCorrect = await verifyPassword(
      oldPassword,
      userFound.password
    );
    if (!passwordCorrect) {
      throw new Error("Incorrect password");
    }
    const passwordHash = await hashPassword(newPassword);

    const userUpdated = await User.findByIdAndUpdate(
      user.id,
      { password: passwordHash },
      { new: true }
    );
    res.json({ data: userUpdated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
