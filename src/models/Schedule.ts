import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISchedule extends Document {
  doctor: Types.ObjectId;
  day: string;
  availableTimeSlots: string[];
  availability: boolean;
}

const scheduleSchema = new Schema<ISchedule>(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day: {
      type: String,
      required: true,
      enum: [
       "Saturday",
       "Sunday",
      " Monday",
      "Tuseday",
      "Wednesday",
      "Thursday"
      ],
    },
    availableTimeSlots: {
      type: [String],
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Schedule = mongoose.model<ISchedule>("Schedule", scheduleSchema);

export default Schedule;