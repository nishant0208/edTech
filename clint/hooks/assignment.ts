import { useState, useCallback } from "react";
import axios from "axios";

interface CreateAssignmentData {
  name: string;
  classId: string;
  subjectId: string;
  teacherId: string;
}

interface GetAssignmentsParams {
  classId?: string;
  subjectId?: string;
  teacherId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/v1/assignment`;

export const useCreateAssignment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAssignment = useCallback(async (data: CreateAssignmentData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("okay here");

      const response = await axios.post(`${API_BASE}/create`, data);
      console.log("logging the response", response.data);

      return response.data;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to create assignment";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createAssignment, isLoading, error };
};

export const useGetAssignments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAssignments = useCallback(async (params?: GetAssignmentsParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE}/all`);
      return response.data;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to fetch assignments";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getAssignments, isLoading, error };
};
