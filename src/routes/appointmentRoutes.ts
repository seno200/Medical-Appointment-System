import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
} from "../controllers/appointmentController";
import { protect, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect, authorize("Patient"), createAppointment);
router.get("/", protect, getAllAppointments);
router.get("/:id", protect, getAppointmentById);
router.put("/:id/status", protect, updateAppointmentStatus);

export default router;