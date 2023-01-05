const express = require("express");
const app = express();
require("./mongo");
const { logErrors, errorHandler } = require("./middlewares/error");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ message: "hola mundo" });
});

// routes
const userRouter = require("./routes/User");
const roleRouter = require("./routes/Role");
const authRouter = require("./routes/Auth");
const paymentRouter = require("./routes/Payment");

app.use("/users", userRouter);
app.use("/roles", roleRouter);
app.use("/auth", authRouter);
app.use("/payments", paymentRouter);

app.use(logErrors);
app.use(errorHandler);

app.listen(4000, () => {
  console.log("SERVER RUNNING IN PORT", 4000);
});
