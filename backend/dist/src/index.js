"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./routes/auth");
const class_1 = require("./routes/class");
const assignment_1 = require("./routes/assignment");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use("/api/v1", auth_1.authRouter);
app.use("/api/v1/class", class_1.classRouter);
app.use("/api/v1/assignment", assignment_1.assignmentRouter);
app.listen(3000, () => {
    console.log("working onapp");
});
