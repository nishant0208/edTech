import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getStudents = async (_req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};


export const getStudentById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        class: true,
        user: {
          select: { email: true },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    return res.status(500).json({ error: "Failed to fetch student" });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, phone, classId } = req.body;

  try {
    const updated = await prisma.student.update({
      where: { id },
      data: {
        name,
        phone,
        classId,
      },
    });
    res.status(200).json(updated);
  } catch (err) {
    console.error("Update student error:", err);
    res.status(500).json({ message: "Failed to update student" });
  }
};

// Delete student
export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.student.delete({ where: { id } });
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Delete student error:", err);
    res.status(500).json({ message: "Failed to delete student" });
  }
};
