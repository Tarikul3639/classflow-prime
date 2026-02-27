import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { IBaseUser, IAdminProfile } from "@/types/profile";

// Base selectors
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectClassroom = (state: RootState) => state.classroom.classroom;

// Check if user is admin
export const selectIsAdmin = createSelector([selectClassroom], (classroom) => {
  if (!classroom?.myRole) return false;
  return classroom.myRole === "admin" || classroom.myRole === "co_admin";
});

export const isMe = (userId: string) =>
  createSelector([selectAuthUser], (user) => {
    if (!user) return false;
    return user._id === userId;
  });

// Get current user's classroom member info
export const selectCurrentUserMember = createSelector(
  [selectAuthUser, selectClassroom],
  (user, classroom) => {
    if (!user || !classroom) return null;
    return classroom.members.find((m) => m.user._id === user._id);
  },
);

// Build profile user data
export const selectProfileUser = createSelector(
  [selectAuthUser, selectClassroom, selectCurrentUserMember],
  (user, classroom, memberInfo): IBaseUser | null => {
    if (!user) return null;
    return {
      ...user,
      currentClassroom: {
        _id: classroom?._id || "",
        name: classroom?.name || "",
        role: memberInfo?.role || "member",
        joinedAt: memberInfo?.joinedAt || "",
      },
      institute: classroom?.institute || "",
      department: classroom?.department || "",
      intake: classroom?.intake || "",
      section: classroom?.section || "",
    };
  },
);

// Build admin profile data
export const selectAdminProfile = createSelector(
  [selectProfileUser, selectClassroom, selectIsAdmin],
  (user, classroom, isAdmin): IAdminProfile | null => {
    if (!user || !classroom || !isAdmin) return null;

    const totalAdmins = classroom.members.filter(
      (m) => m.role === "admin" || m.role === "co_admin",
    ).length;

    const totalBlockedMembers = classroom.members.filter(
      (m) => m.isBlocked,
    ).length;

    return {
      ...user,
      members: classroom.members,
      classroomInfo: {
        joinCode: classroom.joinCode || "N/A",
        isJoinCodeActive: classroom.isJoinCodeActive,
        totalMembers: classroom.totalMembers,
        totalAdmins,
        totalEvents: classroom.totalEvents,
        totalBlockedMembers,
      },
    };
  },
);

// Check permissions
export const selectCanAssignCoAdmin = createSelector(
  [selectCurrentUserMember],
  (member) => member?.role === "admin",
);

export const selectCanBlockUser = createSelector(
  [selectCurrentUserMember],
  (member) => member?.role === "admin" || member?.role === "co_admin",
);

export const selectCanAssignRole = createSelector(
  [selectCurrentUserMember],
  (member) => member?.role === "admin",
);
