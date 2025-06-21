import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/class`;

type Class = {
  id: string;
  name: string;
  grade: number;
  section: string;
  capacity?: number;
  students?: { id: string; name: string; studentId: string }[];
  teachers?: { id: string; name: string; teacherId: string }[];
  subjects?: {
    subject: { id: string; name: string; code: string };
  }[];
};

type CreateClassPayload = {
  name: string;
  grade: number;
  section: string;
  capacity?: number;
};

type UpdateClassPayload = {
  id: string;
  name?: string;
  grade?: number;
  section?: string;
  capacity?: number;
};
export const useGetClasses = () => {
  return useQuery<Class[]>({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/all`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch classes");
      return data.data;
    },
  });
};

export const useGetClassById = (id: string) => {
  return useQuery<Class>({
    queryKey: ["class", id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch class");
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  console.log("use create class here");

  return useMutation({
    mutationFn: async (newClass: CreateClassPayload) => {
      console.log(JSON.stringify(newClass), "before mutation");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/class/create`,
        newClass
      );
      console.log(res, "res here");

      const data = await res.data;

      if (!res.data) throw new Error(data.message || "Failed to create class");
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedClass: UpdateClassPayload) => {
      const res = await fetch(`${API_BASE}/update}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedClass),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update class");
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["class", variables.id] });
    },
  });
};
