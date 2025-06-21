import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createAssignment = async (req: any, res: any) => {
  try {
    const { name, classId, subjectId, teacherId } = req.body;
    console.log(name, classId, subjectId, teacherId);

    if (!name || !classId || !subjectId || !teacherId) {
      return res.status(400).json({
        success: false,
        message: "Name, classId, subjectId, and teacherId are required",
      });
    }

    const classExists = await prisma.class.findUnique({
      where: { name: "Class 2" },
    });
    console.log(classExists, "true or false");

    if (!classExists)
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });

    const subjectExists = await prisma.subject.findUnique({
      where: { name: "Subject 1" },
    });
    if (!subjectExists)
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });

    const teacherExists = await prisma.teacher.findUnique({
      where: { id: teacherId },
    });
    if (!teacherExists)
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });

    const assignment = await prisma.assignment.create({
      data: { name, classId: "Class 2", subjectId: "Subject 1", teacherId },
      include: {
        class: { select: { id: true, name: true, grade: true, section: true } },
        subject: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, name: true, teacherId: true } },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const getAssignments = async (req: any, res: any) => {
  try {
    const {
      classId,
      subjectId,
      teacherId,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;
    const where: any = {};
    if (classId) where.classId = classId;
    if (subjectId) where.subjectId = subjectId;
    if (teacherId) where.teacherId = teacherId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [assignments, totalCount] = await Promise.all([
      prisma.assignment.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          class: {
            select: { id: true, name: true, grade: true, section: true },
          },
          subject: { select: { id: true, name: true, code: true } },
          teacher: { select: { id: true, name: true, teacherId: true } },
        },
      }),
      prisma.assignment.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    return res.status(200).json({
      success: true,
      data: assignments,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const getAssignmentById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Assignment ID is required" });

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            grade: true,
            section: true,
            students: { select: { id: true, name: true, studentId: true } },
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true,
            credits: true,
          },
        },
        teacher: {
          select: { id: true, name: true, teacherId: true, phone: true },
        },
      },
    });

    if (!assignment)
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });

    return res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    console.error("Error fetching assignment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const updateAssignment = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, classId, subjectId } = req.body;

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Assignment ID is required" });

    const existingAssignment = await prisma.assignment.findUnique({
      where: { id },
    });
    if (!existingAssignment)
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });

    const updateData: any = {};
    if (name) updateData.name = name;
    if (classId) {
      const classExists = await prisma.class.findUnique({
        where: { id: classId },
      });
      if (!classExists)
        return res
          .status(404)
          .json({ success: false, message: "Class not found" });
      updateData.classId = classId;
    }

    if (subjectId) {
      const subjectExists = await prisma.subject.findUnique({
        where: { id: subjectId },
      });
      if (!subjectExists)
        return res
          .status(404)
          .json({ success: false, message: "Subject not found" });
      updateData.subjectId = subjectId;
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id },
      data: updateData,
      include: {
        class: { select: { id: true, name: true, grade: true, section: true } },
        subject: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, name: true, teacherId: true } },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      data: updatedAssignment,
    });
  } catch (error) {
    console.error("Error updating assignment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const deleteAssignment = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Assignment ID is required" });

    const existingAssignment = await prisma.assignment.findUnique({
      where: { id },
    });
    if (!existingAssignment)
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });

    await prisma.assignment.delete({ where: { id } });

    return res
      .status(200)
      .json({ success: true, message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const getAssignmentsByTeacher = async (req: any, res: any) => {
  try {
    const { teacherId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!teacherId)
      return res
        .status(400)
        .json({ success: false, message: "Teacher ID is required" });

    const teacherExists = await prisma.teacher.findUnique({
      where: { id: teacherId },
    });
    if (!teacherExists)
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [assignments, totalCount] = await Promise.all([
      prisma.assignment.findMany({
        where: { teacherId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          class: {
            select: { id: true, name: true, grade: true, section: true },
          },
          subject: { select: { id: true, name: true, code: true } },
        },
      }),
      prisma.assignment.count({ where: { teacherId } }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    return res.status(200).json({
      success: true,
      data: assignments,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching teacher assignments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const getAssignmentsByClass = async (req: any, res: any) => {
  try {
    const { classId } = req.params;
    const { subjectId, page = 1, limit = 10 } = req.query;

    if (!classId)
      return res
        .status(400)
        .json({ success: false, message: "Class ID is required" });

    const classExists = await prisma.class.findUnique({
      where: { id: classId },
    });
    if (!classExists)
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });

    const where: any = { classId };
    if (subjectId) where.subjectId = subjectId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [assignments, totalCount] = await Promise.all([
      prisma.assignment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          subject: { select: { id: true, name: true, code: true } },
          teacher: { select: { id: true, name: true, teacherId: true } },
        },
      }),
      prisma.assignment.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    return res.status(200).json({
      success: true,
      data: assignments,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching class assignments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export default {
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByTeacher,
  getAssignmentsByClass,
};
