export enum UserRole {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  PARENT = "PARENT",
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  phone?: string;
  address?: string;
  // Teacher specific
  teacherId?: string;
  dateOfJoining?: string;
  qualification?: string;
  branch?: string;
  // Student specific
  studentId?: string;
  dateOfBirth?: string;
  admissionDate?: string;
  classId?: string;
  // Parent specific
  occupation?: string;
  relationship?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      role: UserRole;
    };
    profile: any;
    token: string;
  };
  error?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  // Role-specific fields will be added dynamically
  [key: string]: any;
}

export interface JWTPayload {
  userId: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
    email: string;
  };
}
