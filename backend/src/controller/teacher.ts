import { Request, Response } from "express";
import { PrismaClient, TeacherStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeachers = async (req: Request, res: Response) => {
  try {
    const { name, subjects, status } = req.query;

    const teachers = await prisma.teacher.findMany({
      where: {
        name: name
          ? { contains: String(name), mode: "insensitive" }
          : undefined,
        status:
          status && status !== "All" ? (status as TeacherStatus) : undefined,
      },
      include: {
        subjects: {
          select: {
            name: true,
            code: true,
          },
        },
      },
    });

    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
};

export const getClasses = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.params;

    const teacher = await prisma.teacher.findUnique({
      where: { teacherId },
      select: { id: true },
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const classes = await prisma.class.findMany({
      where: {
        teachers: {
          some: { teacherId },
        },
      },
      include: {
        students: {
          select: {
            id: true,
            studentId: true,
            name: true,
            user: { select: { email: true } },
          },
        },
        subjects: {
          include: {
            subject: {
              select: { id: true, name: true, code: true },
            },
          },
          where: {
            subject: {
              teacherId: teacher.id,
            },
          },
        },
      },
      orderBy: [{ grade: "asc" }, { section: "asc" }],
    });

    res.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
};

// export const createAssignment = async (req: Request, res: Response) => {
//   try {
//     const { teacherId } = req.params;
//     const { name, classId, subjectId } = req.body;

//     if (!name || !classId || !subjectId) {
//       return res.status(400).json({
//         error: "Name, classId, and subjectId are required",
//       });
//     }

//     const teacher = await prisma.teacher.findUnique({
//       where: { teacherId },
//       select: { id: true },
//     });

//     if (!teacher) {
//       return res.status(404).json({ error: "Teacher not found" });
//     }

//     const hasAccess = await prisma.class.findFirst({
//       where: {
//         id: classId,
//         teachers: {
//           some: { id: teacher.id },
//         },
//         subjects: {
//           some: {
//             subjectId,
//             subject: {
//               teacherId: teacher.id,
//             },
//           },
//         },
//       },
//     });

//     if (!hasAccess) {
//       return res.status(403).json({
//         error: "Access denied to this class or subject",
//       });
//     }

//     const assignment = await prisma.assignment.create({
//       data: {
//         name,
//         classId,
//         subjectId,
//         teacherId: teacher.id,
//       },
//       include: {
//         class: {
//           select: { name: true, grade: true, section: true },
//         },
//         subject: {
//           select: { name: true, code: true },
//         },
//       },
//     });

//     res.status(201).json({
//       message: "Assignment created successfully",
//       assignment,
//     });
//   } catch (error) {
//     console.error("Error creating assignment:", error);
//     res.status(500).json({ error: "Failed to create assignment" });
//   }
// };

export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const { teacherId, assignmentId } = req.params;

    const teacher = await prisma.teacher.findUnique({
      where: { teacherId },
      select: { id: true },
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const assignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        teacherId: teacher.id,
      },
      include: {
        class: {
          include: {
            students: {
              select: {
                id: true,
                studentId: true,
                name: true,
                user: { select: { email: true } },
              },
            },
          },
        },
        subject: true,
        teacher: {
          select: { name: true, teacherId: true },
        },
      },
    });

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json(assignment);
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({ error: "Failed to fetch assignment" });
  }
};

export const updateAssignment = async (req: Request, res: Response) => {
  try {
    const { teacherId, assignmentId } = req.params;
    const { name } = req.body;

    const teacher = await prisma.teacher.findUnique({
      where: { teacherId },
      select: { id: true },
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const assignment = await prisma.assignment.updateMany({
      where: {
        id: assignmentId,
        teacherId: teacher.id,
      },
      data: { name },
    });

    if (assignment.count === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json({ message: "Assignment updated successfully" });
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({ error: "Failed to update assignment" });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const { teacherId, assignmentId } = req.params;

    const teacher = await prisma.teacher.findUnique({
      where: { teacherId },
      select: { id: true },
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const assignment = await prisma.assignment.deleteMany({
      where: {
        id: assignmentId,
        teacherId: teacher.id,
      },
    });

    if (assignment.count === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ error: "Failed to delete assignment" });
  }
};

export const createTeacher = async (req: Request, res: any) => {
  const { name, phone, email, address, qualification, subject } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const user = await prisma.user.create({
      data: {
        email,
        role: "TEACHER",
        password: "passteacher",
        teacher: {
          create: {
            name,
            phone,
            address,
            qualification,
            branch: "",
            status: "ACTIVE",
            subjects:
              subject && subject.length > 0
                ? {
                    connectOrCreate: subject.map((subj: string) => ({
                      where: { name: subj },
                      create: {
                        name: subj,
                        code: subj.substring(0, 3).toUpperCase(),
                      },
                    })),
                  }
                : undefined,
          },
        },
      },
      include: {
        teacher: {
          include: {
            subjects: true,
          },
        },
      },
    });

    res.status(201).json({ message: "Teacher created successfully", user });
  } catch (error: any) {
    console.error("Create Teacher Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, qualification, status, subjects } = req.body;
    console.log("Update teacher body:", req.body);

    const updateData: any = {
      name,
      qualification,
      status,
    };

    if (Array.isArray(subjects)) {
      await prisma.teacher.update({
        where: { id },
        data: {
          subjects: {
            set: [],
          },
        },
      });

      if (subjects.length > 0) {
        for (const subj of subjects) {
          const existingSubject = await prisma.subject.findUnique({
            where: { name: subj.name },
          });

          if (existingSubject) {
            await prisma.teacher.update({
              where: { id },
              data: {
                subjects: {
                  connect: { id: existingSubject.id },
                },
              },
            });
          } else {
            await prisma.teacher.update({
              where: { id },
              data: {
                subjects: {
                  create: {
                    name: subj.name,
                    code: `${subj.name
                      .substring(0, 3)
                      .toUpperCase()}_${Math.random()
                      .toString(36)
                      .substring(2, 7)}`,
                  },
                },
              },
            });
          }
        }
      }
    }

    const updated = await prisma.teacher.findUnique({
      where: { id },
      include: { subjects: true },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ error: "Failed to update teacher" });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.teacher.delete({
      where: { id },
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ error: "Failed to delete teacher" });
  }
};

export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) return res.status(404).json({ error: "Not found" });

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch teacher" });
  }
};
