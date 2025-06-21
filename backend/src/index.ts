import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import classRouter from "./routes/class";
import { assignmentRouter } from "./routes/assignment";
import { eventrouter } from "./routes/event";
import leadRouter from "./routes/lead";
import branchRoutes from "./routes/branch";
import feeRoutes from "./routes/fee";
import studentRouter from "./routes/student";
import teacherRouter from "./routes/teacher";
import dotenv from 'dotenv';
import studentBulkRoutes from './routes/studentBulkRoutes';
import parentBulkRoutes from './routes/parentBulkRoutes';
import teacherBulkRoutes from './routes/teacherBulkRoutes';
const app = express();
dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/events", eventrouter);
app.use("/api/leads", leadRouter);
app.use("/api/branches", branchRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/students", studentRouter);
app.use("/api/teachers", teacherRouter);
app.use("/api/v1", authRouter);
app.use("/api/class", classRouter);
app.use("/api/v1/assignment", assignmentRouter);
app.use('/api/students/bulk-upload', studentBulkRoutes);
app.use('/api/parents/bulk-upload', parentBulkRoutes);
app.use('/api/teachers/bulk-upload', teacherBulkRoutes);

app.listen(3000, () => {
  console.log("working onapp 3000");
});
