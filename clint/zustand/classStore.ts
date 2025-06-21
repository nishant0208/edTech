import { create } from "zustand";

type ClassData = {
  id: string;
  name: string;
  capacity: number;
  createdAt: string;
  grade: number;
  section: string;
  teacher: string;
};

type ClassStore = {
  classInfo: ClassData | null;
  setClass: (data: ClassData) => void;
  updateTeacher: (teacher: string) => void;
  resetClass: () => void;
};

export const useClassStore = create<ClassStore>((set) => ({
  classInfo: null,

  setClass: (data) => set({ classInfo: data }),

  updateTeacher: (teacher) =>
    set((state) =>
      state.classInfo ? { classInfo: { ...state.classInfo, teacher } } : state
    ),

  resetClass: () => set({ classInfo: null }),
}));
