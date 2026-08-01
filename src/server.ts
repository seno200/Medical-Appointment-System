import express from "express";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db";
import swaggerSpec from "./config/swagger";
import authRoutes from "./routes/authRoutes";
import doctorProfileRoutes from "./routes/doctorProfileRoutes";
import scheduleRoutes from "./routes/scheduleRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorProfileRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => {
  res.send("Server is working!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});