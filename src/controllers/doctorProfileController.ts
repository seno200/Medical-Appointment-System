import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import DoctorProfile from "../models/DoctorProfile";

export const createDoctorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const {
      specialty,
      experience,
      clinicAddress,
      consultationFee,
      workingHours,
    } = req.body;

    if (!specialty || !experience || !clinicAddress || !consultationFee || !workingHours) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingProfile = await DoctorProfile.findOne({ user: req.user?.id });
    if (existingProfile) {
      return res.status(400).json({ message: "Doctor profile already exists for this user" });
    }

    const newProfile = await DoctorProfile.create({
      user: req.user?.id,
      specialty,
      experience,
      clinicAddress,
      consultationFee,
      workingHours,
    });

    return res.status(201).json({
      message: "Doctor profile created successfully",
      profile: newProfile,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getAllDoctorProfiles = async (req: AuthRequest, res: Response) => {
  try {
    const { specialty, name } = req.query;

    let filter: any = {};

    if (specialty) {
      filter.specialty = { $regex: specialty, $options: "i" };
    }

    let profiles = await DoctorProfile.find(filter).populate(
      "user",
      "fullName email role"
    );

    if (name) {
      const searchName = (name as string).toLowerCase();
      profiles = profiles.filter((profile: any) =>
        profile.user.fullName.toLowerCase().includes(searchName)
      );
    }

    return res.status(200).json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getDoctorProfileById = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await DoctorProfile.findById(req.params.id).populate(
      "user",
      "fullName email role"
    );

    if (!profile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    return res.status(200).json({ profile });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};



export const updateDoctorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await DoctorProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const isOwner = profile.user.toString() === req.user?.id;
    const isAdmin = req.user?.role === "Admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden: you can only update your own profile" });
    }

    const {
      specialty,
      experience,
      clinicAddress,
      consultationFee,
      workingHours,
      availabilityStatus,
    } = req.body;

    if (specialty !== undefined) profile.specialty = specialty;
    if (experience !== undefined) profile.experience = experience;
    if (clinicAddress !== undefined) profile.clinicAddress = clinicAddress;
    if (consultationFee !== undefined) profile.consultationFee = consultationFee;
    if (workingHours !== undefined) profile.workingHours = workingHours;
    if (availabilityStatus !== undefined) profile.availabilityStatus = availabilityStatus;

    const updatedProfile = await profile.save();

    return res.status(200).json({
      message: "Doctor profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const deleteDoctorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await DoctorProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    await profile.deleteOne();

    return res.status(200).json({ message: "Doctor profile deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};