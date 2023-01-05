const express = require("express");
const router = express.Router();
// middlewares
const { verifyToken } = require("./../middlewares/authenticated");
// models
const Payment = require("./../models/Payment");
const User = require("./../models/User");

router.get("/", async (req, res, next) => {
  try {
    const payments = await Payment.find({}).populate("user");
    res.json({ data: payments });
  } catch (error) {
    next(error);
  }
});

// get payments by user authenticated
router.get("/user", verifyToken, async (req, res, next) => {
  try {
    const { user } = req;
    console.log("AUTHENTICATED", user);
    const payments = await Payment.find({ user: user.id }).populate("user");
    res.json({ data: payments });
  } catch (error) {
    next(error);
  }
});

router.post("/", verifyToken, async (req, res, next) => {
  try {
    const { body, user } = req;
    console.log("BODY", body);
    console.log("AUTHENTICATED", user);
    // create payment
    const newPayment = new Payment(body);
    newPayment.user = user.id;
    const paymentSaved = await newPayment.save();

    // save payment in user
    await User.findByIdAndUpdate(user.id, {
      $push: { payments: newPayment.id },
    });

    res.status(201).json({ data: paymentSaved });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const { body, params, user } = req;
    const { id } = params;
    console.log("BODY", body);
    console.log("AUTHENTICATED", user);
    // find payment
    const paymentFound = await Payment.findById(id);
    if (!paymentFound) {
      throw new Error("Payment not found");
    }
    // update payment
    const paymentUpdated = await Payment.findOneAndUpdate(
      {
        _id: id,
        user: user.id,
      },
      { ...body },
      { new: true }
    );

    if (!paymentUpdated) {
      throw new Error("You don't have permission");
    }

    res.json({ data: paymentUpdated });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const { params, user } = req;
    const { id } = params;
    console.log("AUTHENTICATED", user);
    // find payment
    const paymentFound = await Payment.findById(id);
    if (!paymentFound) {
      throw new Error("Payment not found");
    }
    // delete payment
    const paymentDeleted = await Payment.findOneAndRemove(
      {
        _id: id,
        user: user.id,
      },
      { new: true }
    );

    if (!paymentDeleted) {
      throw new Error("You don't have permission");
    }

    // delete payment in user
    await User.findByIdAndUpdate(user.id, {
      $pull: { payments: paymentFound.id },
    });

    res.status(204).json({ data: paymentFound });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
