const express = require("express");
const router = express.Router();
const {
  get,
  getAttendees,
  createEvent,
  registerAttendee,
} = require("../controllers/event.controller");

/**
 * @openapi
 * /events:
 *   get:
 *     summary: List events
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     summary: Create event
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Created
 * /events/{event_id}/attendees:
 *   get:
 *     summary: List attendees for an event
 *     parameters:
 *       - in: path
 *         name: event_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * /events/{event_id}/register:
 *   post:
 *     summary: Register attendee to event
 *     parameters:
 *       - in: path
 *         name: event_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Registered
 */
router.get("/", get);
router.get("/:event_id/attendees", getAttendees);
router.post("/", createEvent);
router.post("/:event_id/register", registerAttendee);

module.exports = router;
