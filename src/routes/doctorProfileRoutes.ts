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

router.post("/", protect, authorize("Doctor", "Admin"), createDoctorProfile);
router.get("/", protect, getAllDoctorProfiles);
router.get("/:id", protect, getDoctorProfileById);
router.put("/:id", protect, authorize("Doctor", "Admin"), updateDoctorProfile);
router.delete("/:id", protect, authorize("Admin"), deleteDoctorProfile);

export default router;