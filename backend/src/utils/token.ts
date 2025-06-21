import jwt from "jsonwebtoken";
import { JWTPayload, RegisterRequest } from "../types/auth";

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role } as JWTPayload,
    "pawan" as any,
    // @ts-ignore
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export const validateRoleSpecificFields = (
  role: string,
  data: RegisterRequest
): string | null => {
  switch (role) {
    case "TEACHER":
      if (!data.teacherId) return "Teacher ID is required for teachers";
      break;
    case "STUDENT":
      if (!data.studentId) return "Student ID is required for students";
      if (!data.classId) return "Class ID is required for students";
      break;
    default:
      break;
  }
  return null;
};
