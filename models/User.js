const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
    payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("totalPayments").get(function () {
  return this.payments.reduce((total, value) => {
    return total + value;
  }, 0);
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

const User = model("User", userSchema);

module.exports = User;
