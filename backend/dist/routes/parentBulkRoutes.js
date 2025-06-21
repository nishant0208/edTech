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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/parentBulkRoutes.ts
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// Endpoint: POST /api/parents/bulk-upload
router.post('/bulk-upload', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parentRecords = req.body;
    if (!Array.isArray(parentRecords) || parentRecords.length === 0) {
        return res.status(400).json({ message: 'Invalid data format or empty array.' });
    }
    const errors = [];
    const successfulUploads = [];
    for (const record of parentRecords) {
        try {
            // 1. Basic Validation
            if (!record.email || !record.name) {
                throw new Error('Missing required fields (email, name).');
            }
            // 2. Find or Create User
            let user = yield prisma.user.findUnique({ where: { email: record.email } });
            if (!user) {
                const temporaryPassword = Math.random().toString(36).substring(2, 10);
                const hashedPassword = yield bcryptjs_1.default.hash(temporaryPassword, 10);
                user = yield prisma.user.create({
                    data: {
                        email: record.email,
                        password: hashedPassword,
                        role: client_1.UserRole.PARENT, // Assign correct role
                        isActive: true,
                    },
                });
                console.log(`Created new user for parent: ${record.email}`);
            }
            else if (user.role !== client_1.UserRole.PARENT) {
                throw new Error(`Email ${record.email} exists with role ${user.role}. Cannot register as Parent.`);
            }
            // 3. Create Parent Record
            yield prisma.parent.create({
                data: {
                    userId: user.id, // Link to the User
                    name: record.name,
                    phone: record.phone || null,
                    address: record.address || null,
                    occupation: record.occupation || null,
                    relationship: record.relationship || null,
                },
            });
            successfulUploads.push({ email: record.email, name: record.name, status: 'success' });
        }
        catch (e) {
            console.error(`Error processing parent record (${record.email || record.name || JSON.stringify(record)}):`, e.message);
            errors.push({ record: record, error: e.message });
        }
    }
    if (errors.length > 0) {
        return res.status(207).json({
            message: `${successfulUploads.length} parent records uploaded successfully, ${errors.length} failed.`,
            successfulUploads,
            errors,
        });
    }
    return res.status(200).json({
        message: `Successfully uploaded ${successfulUploads.length} parent records.`,
        count: successfulUploads.length,
    });
}));
exports.default = router;
