const express = require("express");
const router = express.Router();
// models
const Role = require("./../models/Role");

router.get("/", async (req, res, next) => {
  try {
    const roles = await Role.find({});
    res.json({ data: roles });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { body } = req;
    const newRole = new Role(body);
    const roleSaved = await newRole.save();
    res.status(201).json({ data: roleSaved });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { body, params } = req;
    const { id } = params;
    const roleFound = await Role.findById(id);
    if (!roleFound) {
      throw new Error("Role not found");
    }
    const roleUpdated = await Role.findByIdAndUpdate(
      id,
      { ...body },
      { new: true }
    );
    res.json({ data: roleUpdated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
