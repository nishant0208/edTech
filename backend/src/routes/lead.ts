import express from "express";
import { PrismaClient } from "@prisma/client";
import {
  approveLeadAndCreateStudent,
  updateLead,
  rejectLead,
} from "../controller/lead";

const prisma = new PrismaClient();
const router = express.Router();

// Get all leads
router.get("/", async (_req, res): Promise<any> => {
  try {
    const leads = await prisma.lead.findMany();
    return res.json(leads);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

// Route for approving leads
router.patch("/approve/:id", approveLeadAndCreateStudent);

// Route for rejecting leads
router.patch("/reject/:id", rejectLead);

// General update route
router.patch("/:id", updateLead);

export default router;
