"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const classes_1 = require("../controller/classes");
const classRouter = express_1.default.Router();
classRouter.get("/all", classes_1.getAllClasses);
classRouter.post("/create", classes_1.createClass);
classRouter.put("/update", classes_1.updateClass);
classRouter.get("/:id", classes_1.getClassById);
classRouter.get("/", classes_1.getClasses); //  Needed for dashboard count
exports.default = classRouter;
