import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { PrismaClient } from "@prisma/client";

import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  AuthenticatedRequest,
} from "../types/auth";
import { generateToken, validateRoleSpecificFields } from "../utils/token";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      role,
      name,
      phone,
      address,
      teacherId,
      dateOfJoining,
      qualification,
      branch,
      dateOfBirth,
      admissionDate,
      classId,
      occupation,
      relationship,
    }: RegisterRequest = req.body;

    if (!email || !password || !role || !name) {
      res.status(400).json({
        success: false,
        message: "Email, password, role, and name are required",
      } as AuthResponse);
      return;
    }

    // const validationError = validateRoleSpecificFields(role, req.body);
    // if (validationError) {
    //   res.status(400).json({
    //     success: false,
    //     message: validationError,
    //   } as AuthResponse);
    //   return;
    // }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User with this email already exists",
      } as AuthResponse);
      return;
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role as any,
        },
      });

      let profile: any;
      switch (role) {
        case "ADMIN":
          profile = await tx.admin.create({
            data: {
              userId: user.id,
              name,
            },
          });
          break;

        case "TEACHER":
          profile = await tx.teacher.create({
            data: {
              userId: user.id,
              teacherId: nanoid(10),
              name,
              phone,
              address,
              dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : null,
              qualification,
              branch: "",
            },
          });
          break;

        case "STUDENT":
          profile = await tx.student.create({
            data: {
              userId: user.id,
              studentId: nanoid(10),
              name,
              phone,
              address,
              dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
              admissionDate: admissionDate ? new Date(admissionDate) : null,
              classId: classId!,
              branch: "",
            },
          });
          break;

        case "PARENT":
          profile = await tx.parent.create({
            data: {
              userId: user.id,
              name,
              phone,
              address,
              occupation,
              relationship,
            },
          });
          break;

        default:
          throw new Error("Invalid role specified");
      }

      return { user, profile };
    });

    const token = generateToken(result.user.id, result.user.role);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role as any,
        },
        profile: result.profile,
        token,
      },
    } as AuthResponse);
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    } as AuthResponse);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      } as AuthResponse);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        admin: true,
        teacher: true,
        student: {
          include: {
            class: true,
          },
        },
        parent: true,
      },
    });

    console.log(user, "user is here");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      } as AuthResponse);
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: "Account is deactivated",
      } as AuthResponse);
      return;
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   res.status(401).json({
    //     success: false,
    //     message: "Invalid credentials",
    //   } as AuthResponse);
    //   return;
    // }

    const token = generateToken(user.id, user.role);

    let profile: any;
    switch (user.role) {
      case "ADMIN":
        profile = user.admin;
        break;
      case "TEACHER":
        profile = user.teacher;
        break;
      case "STUDENT":
        profile = user.student;
        break;
      case "PARENT":
        profile = user.parent;
        break;
    }

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role as any,
        },
        profile,
        token,
      },
    } as AuthResponse);
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    } as AuthResponse);
  }
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        admin: true,
        teacher: true,
        student: {
          include: {
            class: true,
          },
        },
        parent: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    let profile: any;
    switch (user.role) {
      case "ADMIN":
        profile = user.admin;
        break;
      case "TEACHER":
        profile = user.teacher;
        break;
      case "STUDENT":
        profile = user.student;
        break;
      case "PARENT":
        profile = user.parent;
        break;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
        profile,
      },
    });
  } catch (error: any) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getStudents = async (req: any, res: any) => {
  try {
    const students = await prisma.student.findMany();

    if (!students) {
      return res.status(400).json({
        message: "no students found",
      });
    }
    return res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTeachers = async (req: any, res: any) => {
  try {
    const teachers = await prisma.teacher.findMany();

    if (!teachers) {
      return res.status(400).json({
        message: "no teachers found",
      });
    }
    return res.json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createStudent = async (req: Request, res: any) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      dateOfBirth,
      class: classId,
    } = req.body;

    if (!name || !email || !classId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: "passhere",
        role: "STUDENT",
      },
    });

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        studentId: nanoid(),
        name,
        phone,
        address,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        admissionDate: new Date(),
        classId: classId,
        branch: "",
      },
      include: {
        user: true,
        class: true,
      },
    });

    return res.status(201).json({ message: "Student created", data: student });
  } catch (error) {
    console.error("[CREATE_STUDENT]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
