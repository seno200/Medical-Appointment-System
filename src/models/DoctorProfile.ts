import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDoctorProfile extends Document {
  user: Types.ObjectId;
  specialty: string;
  experience: number;
  clinicAddress: string;
  consultationFee: number;
  workingHours: string;
  availabilityStatus: boolean;
}

const doctorProfileSchema = new Schema<IDoctorProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    clinicAddress: {
      type: String,
      required: true,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    workingHours: {
      type: String,
      required: true,
    },
    availabilityStatus: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const DoctorProfile = mongoose.model<IDoctorProfile>(
  "DoctorProfile",
  doctorProfileSchema
);

export default DoctorProfile;