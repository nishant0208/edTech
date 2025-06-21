import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { JWTPayload, AuthenticatedRequest } from "../types/auth";

const prisma = new PrismaClient();

// Authenticate JWT Token
export const authenticate = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Access token is required",
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JWTPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
      return;
    }

    req.user = {
      userId: user.id,
      role: user.role as any,
      email: user.email,
    };

    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
      return;
    }
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        message: "Token expired",
      });
      return;
    }

    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
      return;
    }

    next();
  };
};

export const verifyTeacher = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (req.user.role !== "TEACHER" && req.user.role !== "ADMIN") {
      res.status(403).json({
        success: false,
        message: "Teacher access required",
      });
      return;
    }

    if (req.user.role === "TEACHER") {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: req.user.userId },
      });

      if (!teacher) {
        res.status(403).json({
          success: false,
          message: "Teacher profile not found",
        });
        return;
      }

      req.teacher = {
        id: teacher.id,
        teacherId: teacher.teacherId,
        name: teacher.name,
      };
    }

    next();
  } catch (error: any) {
    console.error("Teacher verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
