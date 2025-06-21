import { useMutation, useQuery } from "@tanstack/react-query";

import axios from "axios";
type SignupFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  name: string;
  phone: string;
  address: string;
};
type LoginFormDaTa = {
  email: string;
  password: string;
};
export const useSignup = () => {
  return useMutation<void, Error, SignupFormData>({
    mutationFn: async (formData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/signup`,
        formData
      );
      console.log(response);

      return response.data;
    },
  });
};

export const useLogin = () => {
  return useMutation<void, Error, LoginFormDaTa>({
    mutationFn: async (formData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/login`,
        formData
      );
      console.log(response.data);

      return response.data;
    },
  });
};

export const getStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/students`
      );
      return response.data;
    },
  });
};

export const getTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/teachers`
      );
      return response.data;
    },
  });
};

export const useCreateTeacher = () => {
  return useMutation({
    mutationFn: async (formData: any) => {
      console.log(formData, "formdata is here");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/teachers`,
        formData
      );
      return response.data;
    },
  });
};
export const getTeachersCount = () => {
  return useQuery({
    queryKey: ["teachersCount"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/teachers/count`
      );
      return response.data.count;
    },
  });
};

export const useCreateStudent = () => {
  return useMutation({
    mutationFn: async (formData: any) => {
      console.log(formData, "form data is here");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/create/student`,
        formData
      );
      console.log(response.data);

      return response.data;
    },
  });
};
