import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
} from "../controllers/appointmentController";
import { protect, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Book a new appointment (Patient only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctor
 *               - appointmentDate
 *               - timeSlot
 *             properties:
 *               doctor:
 *                 type: string
 *                 example: 6a6d40c6062ba41fcb13bcbd
 *               appointmentDate:
 *                 type: string
 *                 example: 2026-09-15
 *               timeSlot:
 *                 type: string
 *                 example: 10:00 AM
 *               notes:
 *                 type: string
 *                 example: Follow-up checkup
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       400:
 *         description: Missing fields, past date, or time slot conflict
 *       403:
 *         description: Forbidden - Patients only
 */
router.post("/", protect, authorize("Patient"), createAppointment);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get appointments (filtered by role, supports status filter)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Confirmed, Completed, Cancelled]
 *         description: Filter appointments by status
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get("/", protect, getAllAppointments);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Get a single appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment found
 *       404:
 *         description: Appointment not found
 */
router.get("/:id", protect, getAppointmentById);

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   put:
 *     summary: Update appointment status (Confirm/Complete/Cancel)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Confirmed, Completed, Cancelled]
 *                 example: Confirmed
 *     responses:
 *       200:
 *         description: Appointment status updated successfully
 *       400:
 *         description: Invalid status or appointment already completed
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Appointment not found
 */
router.put("/:id/status", protect, updateAppointmentStatus);

export default router;