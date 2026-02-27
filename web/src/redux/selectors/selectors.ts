// src/redux/slices/classroom/selectors.ts
import { RootState } from "@/redux/store";

export const classroomId = (state: RootState): string | null => {
  return state.auth.user?.classrooms?.[0] || null;
};

export const classroomName = (state: RootState): string | null => {
  return state.classroom.classroom?.name ?? null;
}

export const isAdmin = (state: RootState): boolean => {
  const role = state.classroom.classroom?.myRole;
  return role === "admin" || role === "co_admin";
};

export const isBlocked = (state: RootState): boolean => {
  return state.classroom.classroom?.isBlocked || false;
}

export const members = (state: RootState) => {
  return state.classroom.classroom?.members || [];
}