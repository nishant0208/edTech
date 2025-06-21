"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBranch = exports.deleteBranch = exports.createBranch = exports.getBranches = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getBranches = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const branches = yield prisma.branch.findMany();
    res.json(branches);
});
exports.getBranches = getBranches;
const createBranch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, students, teachers, classes } = req.body;
    const branch = yield prisma.branch.create({
        data: { name, students, teachers, classes },
    });
    res.json(branch);
});
exports.createBranch = createBranch;
// DELETE /api/branches/:id
const deleteBranch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.branch.delete({ where: { id } });
        res.status(200).json({ success: true, message: "Branch deleted" });
    }
    catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ success: false, message: "Failed to delete branch" });
    }
});
exports.deleteBranch = deleteBranch;
// PUT /api/branches/:id
const updateBranch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, students, teachers, classes } = req.body;
    try {
        const updated = yield prisma.branch.update({
            where: { id },
            data: { name, students, teachers, classes },
        });
        res.status(200).json(updated);
    }
    catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ success: false, message: "Failed to update branch" });
    }
});
exports.updateBranch = updateBranch;
// export const updateBranch = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { name, students, teachers, classes } = req.body;
//   const branch = await prisma.branch.update({
//     where: { id },
//     data: { name, students, teachers, classes },
//   });
//   res.json(branch);
// };
