const Event = require("../models/event.model");
const Attendee = require("../models/attendee.model");
const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

async function get(req, res) {
    try {
        const events = await Event.find({}).sort({ createdAt: -1 });
        return res.json(events);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server error"})
    }
}

async function getAttendees(req, res) {
    try {
        const { event_id } = req.params;
        const event = await Event.findOne({ id: event_id });
        if (!event) return res.status(404).json({ error: "Event not found" });

        const registrations = await Registration.find({ event: event.id });
        const attendeeIds = registrations.map(r => r.attendee);
        const attendees = await Attendee.find({ id: { $in: attendeeIds } });
        return res.json(attendees);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server error"})
    }
}

async function createEvent(req, res) {
    try {
        const { name, location, start_time, end_time, max_capacity } = req.body;
        if (!name || !location || !start_time || !end_time || !max_capacity) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const event = await Event.create({ name, location, start_time, end_time, max_capacity });
        return res.status(201).json(event);
    } catch (error) {
        console.error("createEvent error:", error);
        return res.status(500).json({ error: error?.message || "Internal Server error" })
    }
}

async function registerAttendee(req, res) {
    try {
        const { event_id } = req.params;
        const { name, email } = req.body;
        if (!name || !email) return res.status(400).json({ error: "Missing attendee fields" });

        const event = await Event.findOne({ id: event_id });
        if (!event) return res.status(404).json({ error: "Event not found" });

        const attendee = await Attendee.findOneAndUpdate(
            { email },
            { name, email },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        const currentRegistrations = await Registration.countDocuments({ event: event.id });
        if (currentRegistrations >= event.max_capacity) {
            return res.status(400).json({ error: "Event is at full capacity" });
        }

        const existing = await Registration.findOne({ event: event.id, attendee: attendee.id });
        if (existing) return res.status(409).json({ error: "Attendee already registered" });

        const registration = await Registration.create({ event: event.id, attendee: attendee.id });
        return res.status(201).json({ message: "Registered", registrationId: registration.id });
    } catch (error) {
        console.error("registerAttendee error:", error);
        if (error && (error.code === 11000 || error.name === "MongoServerError")) {
            return res.status(409).json({ error: "Attendee already registered" });
        }
        return res.status(500).json({ error: error?.message || "Internal Server error" })
    }
}


const registrationSchema = new mongoose.Schema(
    {
        id: { type: String, default: () => randomUUID(), index: true, unique: true },
        uuid: { type: String, default: () => randomUUID(), index: true, unique: true },
        event: { type: String, required: true },
        attendee: { type: String, required: true },
    },
    { timestamps: true }
);
registrationSchema.index({ event: 1, attendee: 1 }, { unique: true });
registrationSchema.set("id", false);
const Registration = mongoose.model("Registration", registrationSchema);

module.exports = { get, getAttendees, createEvent, registerAttendee };
