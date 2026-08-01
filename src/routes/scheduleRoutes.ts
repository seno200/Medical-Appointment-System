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

router.post("/", protect, authorize("Doctor", "Admin"), createSchedule);
router.get("/", protect, getAllSchedules);
router.get("/doctor/:doctorId", protect, getSchedulesByDoctor);
router.put("/:id", protect, authorize("Doctor", "Admin"), updateSchedule);
router.delete("/:id", protect, authorize("Doctor", "Admin"), deleteSchedule);

export default router;