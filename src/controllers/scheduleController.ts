import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Schedule from "../models/Schedule";

export const createSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const { day, availableTimeSlots } = req.body;

    if (!day || !availableTimeSlots) {
      return res.status(400).json({ message: "Day and available time slots are required" });
    }

    const existingSchedule = await Schedule.findOne({
      doctor: req.user?.id,
      day,
    });

    if (existingSchedule) {
      return res.status(400).json({ message: "Schedule for this day already exists" });
    }

    const newSchedule = await Schedule.create({
      doctor: req.user?.id,
      day,
      availableTimeSlots,
    });

    return res.status(201).json({
      message: "Schedule created successfully",
      schedule: newSchedule,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};



export const getAllSchedules = async (req: AuthRequest, res: Response) => {
  try {
    const schedules = await Schedule.find().populate(
      "doctor",
      "fullName email role"
    );

    return res.status(200).json({ schedules });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getSchedulesByDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const schedules = await Schedule.find({
      doctor: req.params.doctorId,
    }).populate("doctor", "fullName email role");

    return res.status(200).json({ schedules });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};



export const updateSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    const isOwner = schedule.doctor.toString() === req.user?.id;
    const isAdmin = req.user?.role === "Admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden: you can only update your own schedule" });
    }

    const { availableTimeSlots, availability } = req.body;

    if (availableTimeSlots !== undefined) schedule.availableTimeSlots = availableTimeSlots;
    if (availability !== undefined) schedule.availability = availability;

    const updatedSchedule = await schedule.save();

    return res.status(200).json({
      message: "Schedule updated successfully",
      schedule: updatedSchedule,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const deleteSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    const isOwner = schedule.doctor.toString() === req.user?.id;
    const isAdmin = req.user?.role === "Admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden: you can only delete your own schedule" });
    }

    await schedule.deleteOne();

    return res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};