const mongoose = require("mongoose");
const validator = require("validator");
const constant = require("../../util/constants");
const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      validate: validator.isEmail,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      enum: constant.USER_SOURCE,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

schema.index({ email: 1, source: 1 }, { unique: true });
module.exports = schema;
