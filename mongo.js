const mongoose = require("mongoose");
const { config } = require("./config");

mongoose
  .connect(config.dbMongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error(err);
  });

process.on("uncaughtException", (error) => {
  console.error(error);
  mongoose.disconnect();
});
