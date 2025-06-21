/* eslint-disable */

import { useAuthStore } from "@/zustand/authstore";
import { Calendar, Clock, GraduationCap, Mail } from "lucide-react";

export default function Welcome() {
  const { auth } = useAuthStore();
  console.log(auth, "auth is here");

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {auth?.profile.name}
            </h1>
            <p className="text-blue-100 mb-4">
              Here's what's happening in your classes today
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{auth?.user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4" />
                <span>cs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>9 experience</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Calendar className="h-12 w-12 text-white/80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
