"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classRouter = void 0;
const express_1 = __importDefault(require("express"));
const classes_1 = require("../controller/classes");
exports.classRouter = express_1.default.Router();
exports.classRouter.get("/all", classes_1.getAllClasses);
exports.classRouter.post("/create", classes_1.createClass);
exports.classRouter.put("/update", classes_1.updateClass);
exports.classRouter.get("/:name", classes_1.getClassById);
