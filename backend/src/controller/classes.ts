import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";
export const getClasses = async (_req: Request, res: any): Promise<void> => {
  try {
    const classes = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
        grade: true,
        section: true,
      },
      orderBy: [{ grade: "asc" }, { section: "asc" }],
    });

    return res.json({
      success: true,
      data: classes,
    });
  } catch (error: any) {
    console.error("Get classes error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createClass = async (req: any, res: any): Promise<void> => {
  try {
    const { name, grade, section, capacity } = req.body;

    if (!name || !grade || !section) {
      res.status(400).json({
        success: false,
        message: "Name, grade, and section are required",
      });
      return;
    }

    if (typeof grade !== "number" || grade < 1 || grade > 12) {
      res.status(400).json({
        success: false,
        message: "Grade must be a number between 1 and 12",
      });
      return;
    }

    const existingClass = await prisma.class.findUnique({
      where: {
        grade_section: {
          grade: grade,
          section: section,
        },
      },
    });

    if (existingClass) {
      res.status(409).json({
        success: false,
        message: "Class with this grade and section already exists",
      });
      return;
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        grade,
        section,
        capacity: capacity || null,
      },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            studentId: true,
          },
        },
        teachers: {
          select: {
            id: true,
            name: true,
            teacherId: true,
          },
        },
        subjects: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: newClass,
    });
  } catch (error: any) {
    console.error("Create class error:", error);

    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "Class name must be unique",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to create class",
    });
  }
};

export const updateClass = async (req: any, res: any): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, grade, section, capacity } = req.body;

    // Check if class exists
    const existingClass = await prisma.class.findUnique({
      where: { id },
    });

    if (!existingClass) {
      res.status(404).json({
        success: false,
        message: "Class not found",
      });
      return;
    }

    // Validate grade if provided
    if (
      grade !== undefined &&
      (typeof grade !== "number" || grade < 1 || grade > 12)
    ) {
      res.status(400).json({
        success: false,
        message: "Grade must be a number between 1 and 12",
      });
      return;
    }

    // Check for duplicate grade/section combination if either is being updated
    if (grade !== undefined || section !== undefined) {
      const newGrade = grade !== undefined ? grade : existingClass.grade;
      const newSection =
        section !== undefined ? section : existingClass.section;

      if (
        newGrade !== existingClass.grade ||
        newSection !== existingClass.section
      ) {
        const duplicateClass = await prisma.class.findUnique({
          where: {
            grade_section: {
              grade: newGrade,
              section: newSection,
            },
          },
        });

        if (duplicateClass && duplicateClass.id !== id) {
          res.status(409).json({
            success: false,
            message: "Class with this grade and section already exists",
          });
          return;
        }
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (grade !== undefined) updateData.grade = grade;
    if (section !== undefined) updateData.section = section;
    if (capacity !== undefined) updateData.capacity = capacity;

    // Update class
    const updatedClass = await prisma.class.update({
      where: { id },
      data: updateData,
      include: {
        students: {
          select: {
            id: true,
            name: true,
            studentId: true,
          },
        },
        teachers: {
          select: {
            id: true,
            name: true,
            teacherId: true,
          },
        },
        subjects: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      data: updatedClass,
    });
  } catch (error: any) {
    console.error("Update class error:", error);

    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "Class name must be unique",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to update class",
    });
  }
};

export const getAllClasses = async (req: any, res: any): Promise<void> => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        students: {
          select: {
            id: true,
            name: true,
            studentId: true,
          },
        },
        teachers: {
          select: {
            id: true,
            name: true,
            teacherId: true,
          },
        },
        subjects: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
      orderBy: [{ grade: "asc" }, { section: "asc" }],
    });

    res.status(200).json({
      success: true,
      message: "Classes retrieved successfully",
      data: classes,
    });
  } catch (error: any) {
    console.error("Get classes error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve classes",
    });
  }
};


export const getClassById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        students: true,
        teachers: true,
        subjects: true,
        assignments: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!classData) {
      res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      data: classData,
    });
  } catch (err) {
    console.error("Error fetching class:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
