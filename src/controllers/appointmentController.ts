import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Appointment from "../models/Appointment";

export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { doctor, appointmentDate, timeSlot, notes } = req.body;

    if (!doctor || !appointmentDate || !timeSlot) {
      return res.status(400).json({ message: "Doctor, date, and time slot are required" });
    }

    const requestedDate = new Date(appointmentDate);
    const now = new Date();

    if (requestedDate <= now) {
      return res.status(400).json({ message: "Appointments can only be booked for future dates" });
    }

    const patientConflict = await Appointment.findOne({
      patient: req.user?.id,
      appointmentDate: requestedDate,
      timeSlot,
      status: { $ne: "Cancelled" },
    });

    if (patientConflict) {
      return res.status(400).json({ message: "You already have an appointment at this time" });
    }

    const doctorConflict = await Appointment.findOne({
      doctor,
      appointmentDate: requestedDate,
      timeSlot,
      status: { $ne: "Cancelled" },
    });

    if (doctorConflict) {
      return res.status(400).json({ message: "This doctor is not available at this time" });
    }

    const newAppointment = await Appointment.create({
      patient: req.user?.id,
      doctor,
      appointmentDate: requestedDate,
      timeSlot,
      notes,
    });

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};


export const getAllAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;

    let filter: any = {};

    if (req.user?.role === "Patient") {
      filter.patient = req.user.id;
    } else if (req.user?.role === "Doctor") {
      filter.doctor = req.user.id;
    }

    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate("patient", "fullName email")
      .populate("doctor", "fullName email");

    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getAppointmentById = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "fullName email")
      .populate("doctor", "fullName email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({ appointment });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};


export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (appointment.status === "Completed") {
      return res.status(400).json({ message: "Completed appointments cannot be edited" });
    }

    const isDoctor = appointment.doctor.toString() === req.user?.id;
    const isPatient = appointment.patient.toString() === req.user?.id;
    const isAdmin = req.user?.role === "Admin";

    if (status === "Cancelled") {
      if (!isPatient && !isDoctor && !isAdmin) {
        return res.status(403).json({ message: "Forbidden: you cannot cancel this appointment" });
      }

      if (isPatient && appointment.appointmentDate <= new Date()) {
        return res.status(400).json({ message: "Cannot cancel an appointment that has already passed" });
      }
    } else {
      if (!isDoctor && !isAdmin) {
        return res.status(403).json({ message: "Forbidden: only the doctor can update this status" });
      }
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();

    return res.status(200).json({
      message: "Appointment status updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};