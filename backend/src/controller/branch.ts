import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getBranches = async (_req: Request, res: Response) => {
  const branches = await prisma.branch.findMany();
  res.json(branches);
};

export const createBranch = async (req: Request, res: Response) => {
  const { name, students, teachers, classes } = req.body;
  const branch = await prisma.branch.create({
    data: { name, students, teachers, classes },
  });
  res.json(branch);
};

// DELETE /api/branches/:id
export const deleteBranch = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.branch.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Branch deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Failed to delete branch" });
  }
};

// PUT /api/branches/:id
export const updateBranch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, students, teachers, classes } = req.body;
  try {
    const updated = await prisma.branch.update({
      where: { id },
      data: { name, students, teachers, classes },
    });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Failed to update branch" });
  }
};


// export const updateBranch = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { name, students, teachers, classes } = req.body;
//   const branch = await prisma.branch.update({
//     where: { id },
//     data: { name, students, teachers, classes },
//   });
//   res.json(branch);
// };