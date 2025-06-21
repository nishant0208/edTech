"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const branch_1 = require("../controller/branch");
const router = express_1.default.Router();
router.get("/", branch_1.getBranches);
router.post("/", branch_1.createBranch);
router.delete("/:id", branch_1.deleteBranch);
router.put("/:id", branch_1.updateBranch);
exports.default = router;
