"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./routes/auth");
const class_1 = __importDefault(require("./routes/class"));
const assignment_1 = require("./routes/assignment");
const event_1 = require("./routes/event");
const lead_1 = __importDefault(require("./routes/lead"));
const branch_1 = __importDefault(require("./routes/branch"));
const fee_1 = __importDefault(require("./routes/fee"));
const student_1 = __importDefault(require("./routes/student"));
const teacher_1 = __importDefault(require("./routes/teacher"));
const dotenv_1 = __importDefault(require("dotenv"));
const studentBulkRoutes_1 = __importDefault(require("./routes/studentBulkRoutes"));
const parentBulkRoutes_1 = __importDefault(require("./routes/parentBulkRoutes"));
const teacherBulkRoutes_1 = __importDefault(require("./routes/teacherBulkRoutes"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use("/api/events", event_1.eventrouter);
app.use("/api/leads", lead_1.default);
app.use("/api/branches", branch_1.default);
app.use("/api/fees", fee_1.default);
app.use("/api/students", student_1.default);
app.use("/api/teachers", teacher_1.default);
app.use("/api/v1", auth_1.authRouter);
app.use("/api/class", class_1.default);
app.use("/api/v1/assignment", assignment_1.assignmentRouter);
app.use('/api/students/bulk-upload', studentBulkRoutes_1.default);
app.use('/api/parents/bulk-upload', parentBulkRoutes_1.default);
app.use('/api/teachers/bulk-upload', teacherBulkRoutes_1.default);
app.listen(3000, () => {
    console.log("working onapp 3000");
});
