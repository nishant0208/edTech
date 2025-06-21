import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { v4 as uuidv4 } from "uuid";
export const getLeads = async (_req: Request, res: Response) => {
  const leads = await prisma.lead.findMany();
  res.json(leads);
};

export const createLead = async (req: Request, res: Response) => {
  const { studentName, parentName, contactEmail, contactPhone, desiredClass } =
    req.body;
  const lead = await prisma.lead.create({
    data: { studentName, parentName, contactEmail, contactPhone, desiredClass },
  });
  console.log(lead, "lead is created ");

  res.json(lead);
};

export const updateLeadStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;
  const lead = await prisma.lead.update({
    where: { id },
    data: { status, rejectionReason },
  });
  res.json(lead);
};

export const rejectLead = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    const lead = await prisma.lead.findUnique({ where: { id } });

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

    const updatedLead = await prisma.lead.update({
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
  } catch (error) {
    console.error("Error rejecting lead:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject lead",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        status,
        ...(rejectionReason && { rejectionReason }),
        updatedAt: new Date(),
      },
    });

    // If approved, create student
    if (status === "Approved") {
      const exists = await prisma.student.findFirst({
        where: {
          name: updatedLead.studentName,
          phone: updatedLead.contactPhone,
        },
      });

      if (!exists) {
        const user = await prisma.user.create({
          data: {
            email:
              updatedLead.contactEmail || `student-${Date.now()}@example.com`,
            password: "temporary-password",
            role: "STUDENT",
          },
        });

        await prisma.student.create({
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
      message:
        status === "Approved"
          ? "Lead approved and student created successfully"
          : status === "Rejected"
          ? "Lead rejected successfully"
          : "Lead updated successfully",
    });
  } catch (err) {
    console.error("Error updating lead:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update lead",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const approveLeadAndCreateStudent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({ where: { id } });
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

    const user = await prisma.user.create({
      data: {
        email: lead.contactEmail || `student-${Date.now()}@example.com`,
        password: "temporary-password",
        role: "STUDENT",
      },
    });

    const student = await prisma.student.create({
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

    const updatedLead = await prisma.lead.update({
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
  } catch (error) {
    console.error("Error in approveLeadAndCreateStudent:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve lead and create student",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
