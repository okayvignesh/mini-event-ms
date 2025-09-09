const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const eventSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => randomUUID(), index: true, unique: true },
    uuid: { type: String, default: () => randomUUID(), index: true, unique: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    max_capacity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

eventSchema.pre("validate", function(next) {
  if (!this.uuid) {
    this.uuid = randomUUID();
  }
  next();
});

eventSchema.set("id", false);

module.exports = mongoose.model("Event", eventSchema);
