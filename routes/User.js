const express = require("express");
const router = express.Router();
// middlewares
const { hashPassword } = require("./../middlewares/authenticated");
// models
const User = require("./../models/User");
const Role = require("./../models/Role");

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).populate("roles");
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { body } = req;
    const { password, roles, ...rest } = body;
    console.log("BODY", body);

    const passwordHash = await hashPassword(password);
    const newUser = new User({ ...rest, password: passwordHash });

    if (roles) {
      const rolesFound = await Role.find({ name: { $in: roles } });
      newUser.roles = rolesFound.map((role) => role.id);
    } else {
      const role = await Role.find({ name: "user" });
      newUser.roles = [role.id];
    }

    const userSaved = await newUser.save();
    res.status(201).json({ data: userSaved });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { body, params } = req;
    const { id } = params;
    const { roles, ...rest } = body;
    console.log("BODY", body);
    console.log("PARAMS", params);

    const userFound = await User.findById(id);
    if (!userFound) {
      throw new Error("User not found");
    }

    let userRoles = [];

    if (roles) {
      const rolesFound = await Role.find({ name: { $in: roles } });
      userRoles = rolesFound.map((role) => role.id);
    } else {
      const role = await Role.find({ name: "user" });
      userRoles = [role.id];
    }

    const userUpdated = await User.findByIdAndUpdate(
      id,
      { ...rest, roles: userRoles },
      { new: true }
    );
    res.json({ data: userUpdated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
