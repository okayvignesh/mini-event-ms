const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const attendeeSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => randomUUID(), index: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
  },
  { timestamps: true }
);

attendeeSchema.index({ email: 1 }, { unique: true });

attendeeSchema.set("id", false);

module.exports = mongoose.model("Attendee", attendeeSchema);


