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
exports.approveLeadAndCreateStudent = exports.updateLead = exports.rejectLead = exports.updateLeadStatus = exports.createLead = exports.getLeads = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getLeads = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const leads = yield prisma.lead.findMany();
    res.json(leads);
});
exports.getLeads = getLeads;
const createLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentName, parentName, contactEmail, contactPhone, desiredClass } = req.body;
    const lead = yield prisma.lead.create({
        data: { studentName, parentName, contactEmail, contactPhone, desiredClass },
    });
    console.log(lead, "lead is created ");
    res.json(lead);
});
exports.createLead = createLead;
const updateLeadStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    const lead = yield prisma.lead.update({
        where: { id },
        data: { status, rejectionReason },
    });
    res.json(lead);
});
exports.updateLeadStatus = updateLeadStatus;
const rejectLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;
        if (!rejectionReason || rejectionReason.trim() === "") {
            res.status(400).json({
                success: false,
                message: "Rejection reason is required",
            });
            return;
        }
        const lead = yield prisma.lead.findUnique({ where: { id } });
        if (!lead) {
            res.status(404).json({
                success: false,
                message: "Lead not found",
            });
            return;
        }
        if (lead.status === "Rejected") {
            res.status(400).json({
                success: false,
                message: "Lead is already rejected",
            });
            return;
        }
        const updatedLead = yield prisma.lead.update({
            where: { id },
            data: {
                status: "Rejected",
                rejectionReason,
                updatedAt: new Date(),
            },
        });
        res.status(200).json({
            success: true,
            message: "Lead rejected successfully",
            data: updatedLead,
        });
    }
    catch (error) {
        console.error("Error rejecting lead:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reject lead",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.rejectLead = rejectLead;
const updateLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;
        const updatedLead = yield prisma.lead.update({
            where: { id },
            data: Object.assign(Object.assign({ status }, (rejectionReason && { rejectionReason })), { updatedAt: new Date() }),
        });
        // If approved, create student
        if (status === "Approved") {
            const exists = yield prisma.student.findFirst({
                where: {
                    name: updatedLead.studentName,
                    phone: updatedLead.contactPhone,
                },
            });
            if (!exists) {
                const user = yield prisma.user.create({
                    data: {
                        email: updatedLead.contactEmail || `student-${Date.now()}@example.com`,
                        password: "temporary-password",
                        role: "STUDENT",
                    },
                });
                yield prisma.student.create({
                    data: {
                        userId: user.id,
                        studentId: "STU-" + Date.now(),
                        name: updatedLead.studentName,
                        phone: updatedLead.contactPhone,
                        dateOfBirth: new Date("2005-01-01"), // Default date
                        admissionDate: new Date(),
                        branch: "Default Branch",
                    },
                });
            }
        }
        res.status(200).json({
            success: true,
            data: updatedLead,
            message: status === "Approved"
                ? "Lead approved and student created successfully"
                : status === "Rejected"
                    ? "Lead rejected successfully"
                    : "Lead updated successfully",
        });
    }
    catch (err) {
        console.error("Error updating lead:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update lead",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
});
exports.updateLead = updateLead;
const approveLeadAndCreateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const lead = yield prisma.lead.findUnique({ where: { id } });
        if (!lead) {
            return res
                .status(404)
                .json({ success: false, message: "Lead not found" });
        }
        if (lead.status === "Approved") {
            return res
                .status(400)
                .json({ success: false, message: "Lead is already approved" });
        }
        const user = yield prisma.user.create({
            data: {
                email: lead.contactEmail || `student-${Date.now()}@example.com`,
                password: "temporary-password",
                role: "STUDENT",
            },
        });
        const student = yield prisma.student.create({
            data: {
                userId: user.id,
                studentId: "STU-" + Date.now(),
                name: lead.studentName,
                phone: lead.contactPhone,
                dateOfBirth: new Date("2005-01-01"),
                admissionDate: new Date(),
                branch: "Default Branch",
            },
        });
        const updatedLead = yield prisma.lead.update({
            where: { id },
            data: { status: "Approved" },
        });
        console.log("Student created successfully:", student);
        console.log("Lead approved:", updatedLead);
        res.status(200).json({
            success: true,
            message: "Lead approved and student created successfully",
            data: {
                student,
                lead: updatedLead,
            },
        });
    }
    catch (error) {
        console.error("Error in approveLeadAndCreateStudent:", error);
        res.status(500).json({
            success: false,
            message: "Failed to approve lead and create student",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.approveLeadAndCreateStudent = approveLeadAndCreateStudent;
