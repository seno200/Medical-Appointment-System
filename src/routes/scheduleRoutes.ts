import express from "express";
import {
  createSchedule,
  getAllSchedules,
  getSchedulesByDoctor,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController";
import { protect, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Create a schedule for a specific day (Doctor or Admin only)
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day
 *               - availableTimeSlots
 *             properties:
 *               day:
 *                 type: string
 *                 enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *                 example: Monday
 *               availableTimeSlots:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["9:00 AM", "10:00 AM", "2:00 PM"]
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       400:
 *         description: Missing fields or schedule already exists for this day
 */
router.post("/", protect, authorize("Doctor", "Admin"), createSchedule);

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Get all schedules
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all schedules
 */
router.get("/", protect, getAllSchedules);

/**
 * @swagger
 * /api/schedules/doctor/{doctorId}:
 *   get:
 *     summary: Get all schedules for a specific doctor
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor's User ID
 *     responses:
 *       200:
 *         description: List of schedules for the doctor
 */
router.get("/doctor/:doctorId", protect, getSchedulesByDoctor);

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Update a schedule (owner or Admin only)
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availableTimeSlots:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["11:00 AM", "3:00 PM"]
 *               availability:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       403:
 *         description: Forbidden - not the owner
 *       404:
 *         description: Schedule not found
 */
router.put("/:id", protect, authorize("Doctor", "Admin"), updateSchedule);

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     summary: Delete a schedule (owner or Admin only)
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       403:
 *         description: Forbidden - not the owner
 *       404:
 *         description: Schedule not found
 */
router.delete("/:id", protect, authorize("Doctor", "Admin"), deleteSchedule);

export default router;