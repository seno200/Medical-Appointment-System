import express from "express";
import {
  createDoctorProfile,
  getAllDoctorProfiles,
  getDoctorProfileById,
  updateDoctorProfile,
  deleteDoctorProfile,
} from "../controllers/doctorProfileController";
import { protect, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /api/doctors:
 *   post:
 *     summary: Create a doctor profile (Doctor or Admin only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - specialty
 *               - experience
 *               - clinicAddress
 *               - consultationFee
 *               - workingHours
 *             properties:
 *               specialty:
 *                 type: string
 *                 example: Cardiology
 *               experience:
 *                 type: number
 *                 example: 10
 *               clinicAddress:
 *                 type: string
 *                 example: 123 Main St, Cairo
 *               consultationFee:
 *                 type: number
 *                 example: 300
 *               workingHours:
 *                 type: string
 *                 example: 9 AM - 5 PM
 *     responses:
 *       201:
 *         description: Doctor profile created successfully
 *       400:
 *         description: Missing fields or profile already exists
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.post("/", protect, authorize("Doctor", "Admin"), createDoctorProfile);

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Get all doctor profiles (supports search by specialty and name)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: specialty
 *         schema:
 *           type: string
 *         description: Filter by specialty (partial match)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by doctor's full name (partial match)
 *     responses:
 *       200:
 *         description: List of doctor profiles
 */
router.get("/", protect, getAllDoctorProfiles);

/**
 * @swagger
 * /api/doctors/{id}:
 *   get:
 *     summary: Get a single doctor profile by ID
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor profile ID
 *     responses:
 *       200:
 *         description: Doctor profile found
 *       404:
 *         description: Doctor profile not found
 */
router.get("/:id", protect, getDoctorProfileById);

/**
 * @swagger
 * /api/doctors/{id}:
 *   put:
 *     summary: Update a doctor profile (owner or Admin only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor profile ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               consultationFee:
 *                 type: number
 *                 example: 350
 *     responses:
 *       200:
 *         description: Doctor profile updated successfully
 *       403:
 *         description: Forbidden - not the owner
 *       404:
 *         description: Doctor profile not found
 */
router.put("/:id", protect, authorize("Doctor", "Admin"), updateDoctorProfile);

/**
 * @swagger
 * /api/doctors/{id}:
 *   delete:
 *     summary: Delete a doctor profile (Admin only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor profile ID
 *     responses:
 *       200:
 *         description: Doctor profile deleted successfully
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Doctor profile not found
 */
router.delete("/:id", protect, authorize("Admin"), deleteDoctorProfile);

export default router;