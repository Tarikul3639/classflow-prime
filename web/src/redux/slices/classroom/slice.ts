import { createSlice } from "@reduxjs/toolkit";
import { ClassroomState } from "@/redux/slices/classroom/types";

// Thunks of classroom
import {
  createClassroomThunk,
  fetchClassroomThunk,
  deleteClassroomThunk,
  leaveClassroomThunk,
  joinClassroomThunk,
} from "./thunks/classroom/index";

// Thunks of events
import { createEventThunk } from "./thunks/event/createEventThunk";
import { updateEventThunk } from "./thunks/event/updateEventThunk";
import { deleteEventThunk } from "./thunks/event/deleteEventThunk";

// Thunks of user management
import {
  assignRoleThunk,
  removeMemberThunk,
  blockUserThunk,
  unblockUserThunk,
} from "./thunks/classroom/member/index";

// Initial State
const initialState: ClassroomState = {
  classroom: null,
  loading: false,
  error: null,
  requestStatus: {
    // Classroom related statuses
    fetchClassroom: { loading: false, error: null },
    joinClassroom: { loading: false, error: null },
    leaveClassroom: { loading: false, error: null },
    createClassroom: { loading: false, error: null },
    deleteClassroom: { loading: false, error: null },
    // Event related statuses
    fetchEvents: { loading: false, error: null },
    updateEvent: { loading: false, error: null },
    deleteEvent: { loading: false, error: null },
    createEvent: { loading: false, error: null },
    // User management statuses
    blockUser: { loading: false, error: null },
    unblockUser: { loading: false, error: null },
    assignRole: { loading: false, error: null },
    removeMember: { loading: false, error: null },
  },
};

const classroomSlice = createSlice({
  name: "classroom",
  initialState: initialState,
  reducers: {
    // Set error for createClassroom
    setCreateClassroomError(state, action) {
      state.requestStatus.createClassroom.error = action.payload;
    },
    // Set error for joinClassroom
    setJoinClassroomError(state, action) {
      state.requestStatus.joinClassroom.error = action.payload;
    },
    // Set error for leaveClassroom
    setLeaveClassroomError(state, action) {
      state.requestStatus.leaveClassroom.error = action.payload;
    },
    // Set error for Delete Classroom
    setDeleteClassroomError(state, action) {
      state.requestStatus.deleteClassroom.error = action.payload;
    },
    // Set error for Delete Event
    setDeleteEventError(state, action) {
      state.requestStatus.deleteEvent.error = action.payload;
    },
    // Set error for Update Event
    setUpdateEventError(state, action) {
      state.requestStatus.updateEvent.error = action.payload;
    },
    // Set Mark as Prepared
    setMarkEventAsPrepared(state, action) {
      if (!state.classroom) return;
      const event = state.classroom.events.find(
        (e) => e._id === action.payload.eventId,
      );
      if (event) {
        event.isCompleted = action.payload.isCompleted;
      }
    },
  },
  extraReducers: (builder) => {
    //----------------------------------------------
    // ------------Classroom Thunks-------------------
    //----------------------------------------------

    // Fetch User Classrooms
    builder
      .addCase(fetchClassroomThunk.pending, (state) => {
        state.requestStatus.fetchClassroom.loading = true;
        state.requestStatus.fetchClassroom.error = null;
        state.error = null;
      })
      .addCase(fetchClassroomThunk.fulfilled, (state, action) => {
        state.requestStatus.fetchClassroom.loading = false;
        state.classroom = action.payload;
      })
      .addCase(fetchClassroomThunk.rejected, (state, action) => {
        state.requestStatus.fetchClassroom.loading = false;
        state.requestStatus.fetchClassroom.error = action.payload as string;
        state.error = action.payload as string;
      });

    // Create Classroom
    builder
      .addCase(createClassroomThunk.pending, (state) => {
        state.requestStatus.createClassroom.loading = true;
        state.requestStatus.createClassroom.error = null;
        state.error = null;
      })
      .addCase(createClassroomThunk.fulfilled, (state, action) => {
        state.requestStatus.createClassroom.loading = false;
        state.classroom = action.payload;
      })
      .addCase(createClassroomThunk.rejected, (state, action) => {
        state.requestStatus.createClassroom.loading = false;
        state.requestStatus.createClassroom.error = action.payload as string;
        state.error = action.payload as string;
      });

    //

    // Join Classroom
    builder
      .addCase(joinClassroomThunk.pending, (state) => {
        state.requestStatus.joinClassroom.loading = true;
        state.requestStatus.joinClassroom.error = null;
        state.error = null;
      })
      .addCase(joinClassroomThunk.fulfilled, (state, action) => {
        state.requestStatus.joinClassroom.loading = false;

        state.classroom = action.payload;
      })
      .addCase(joinClassroomThunk.rejected, (state, action) => {
        state.requestStatus.joinClassroom.loading = false;
        state.requestStatus.joinClassroom.error = action.payload as string;
        state.error = action.payload as string;
      });

    // Leave Classroom
    builder
      .addCase(leaveClassroomThunk.pending, (state) => {
        state.requestStatus.leaveClassroom.loading = true;
        state.requestStatus.leaveClassroom.error = null;
        state.error = null;
      })
      .addCase(leaveClassroomThunk.fulfilled, (state, _) => {
        state.requestStatus.leaveClassroom.loading = false;
        state.classroom = null;
        state.error = null;
      })
      .addCase(leaveClassroomThunk.rejected, (state, action) => {
        state.requestStatus.leaveClassroom.loading = false;
        state.requestStatus.leaveClassroom.error = action.payload as string;
        state.error = action.payload as string;
      });
    // Delete Classroom
    builder
      .addCase(deleteClassroomThunk.pending, (state) => {
        state.requestStatus.deleteClassroom.loading = true;
        state.requestStatus.deleteClassroom.error = null;
        state.error = null;
      })
      .addCase(deleteClassroomThunk.fulfilled, (state, _) => {
        state.requestStatus.deleteClassroom.loading = false;
        state.classroom = null;
        state.error = null;
      })
      .addCase(deleteClassroomThunk.rejected, (state, action) => {
        state.requestStatus.deleteClassroom.loading = false;
        state.requestStatus.deleteClassroom.error = action.payload as string;
        state.error = action.payload as string;
      });

    //----------------------------------------------
    // ------------------Event Thunks-------------------
    //----------------------------------------------

    // Create Event
    builder
      .addCase(createEventThunk.pending, (state) => {
        state.requestStatus.createEvent.loading = true;
        state.requestStatus.createEvent.error = null;
        state.error = null;
      })
      .addCase(createEventThunk.fulfilled, (state, action) => {
        state.requestStatus.createEvent.loading = false;
        if (state.classroom) {
          state.classroom.events.push(action.payload);
          state.classroom.totalEvents += 1;
        }
      })
      .addCase(createEventThunk.rejected, (state, action) => {
        state.requestStatus.createEvent.loading = false;
        state.requestStatus.createEvent.error = action.payload as string;
        state.error = action.payload as string;
      });

    // Update Event
    builder
      .addCase(updateEventThunk.pending, (state) => {
        state.requestStatus.updateEvent.loading = true;
        state.requestStatus.updateEvent.error = null;
        state.error = null;
      })
      .addCase(updateEventThunk.fulfilled, (state, action) => {
        state.requestStatus.updateEvent.loading = false;
        if (state.classroom) {
          const index = state.classroom.events.findIndex(
            (event) => event._id === action.payload._id,
          );
          if (index !== -1) {
            state.classroom.events[index] = action.payload;
          }
        }
      })
      .addCase(updateEventThunk.rejected, (state, action) => {
        state.requestStatus.updateEvent.loading = false;
        state.requestStatus.updateEvent.error = action.payload as string;
        state.error = action.payload as string;
      });

    // Delete Event
    builder
      .addCase(deleteEventThunk.pending, (state, _) => {
        state.requestStatus.deleteEvent.loading = true;
        state.requestStatus.deleteEvent.error = null;
        state.error = null;
      })
      .addCase(deleteEventThunk.fulfilled, (state, action) => {
        state.requestStatus.deleteEvent.loading = false;

        if (!state.classroom) return;

        state.classroom.events = state.classroom.events.filter(
          (e) => e._id !== action.payload,
        );
      })
      .addCase(deleteEventThunk.rejected, (state, action) => {
        state.requestStatus.deleteEvent.loading = false;
        state.requestStatus.deleteEvent.error = action.payload as string;
        state.error = action.payload as string;
      });

    // ----------------------------------------------
    // --------------User Management Thunks----------
    // ----------------------------------------------

    // Block User
    builder
      .addCase(blockUserThunk.pending, (state) => {
        state.requestStatus.blockUser.loading = true;
        state.requestStatus.blockUser.error = null;
        state.error = null;
      })
      .addCase(blockUserThunk.fulfilled, (state, action) => {
        state.requestStatus.blockUser.loading = false;
        if (state.classroom) {
          const isBlocked = action.payload.data?.isBlocked;
          const userId = action.payload.data?.userId;
          if (isBlocked !== undefined && userId) {
            const member = state.classroom.members.find(
              (m) => m.user._id === userId,
            );
            if (member) {
              member.isBlocked = isBlocked;
            }
          }
        }
      })
      .addCase(blockUserThunk.rejected, (state, action) => {
        state.requestStatus.blockUser.loading = false;
        state.requestStatus.blockUser.error = action.payload as string;
        state.error = action.payload as string;
      });

    // Unblock User
    builder
      .addCase(unblockUserThunk.pending, (state) => {
        state.requestStatus.unblockUser.loading = true;
        state.requestStatus.unblockUser.error = null;
        state.error = null;
      })
      .addCase(unblockUserThunk.fulfilled, (state, action) => {
        state.requestStatus.unblockUser.loading = false;
        if (state.classroom) {
          const isBlocked = action.payload.data?.isBlocked;
          const userId = action.payload.data?.userId;
          if (isBlocked !== undefined && userId) {
            const member = state.classroom.members.find(
              (m) => m.user._id === userId,
            );
            if (member) {
              member.isBlocked = isBlocked;
            }
          }
        }
      })
      .addCase(unblockUserThunk.rejected, (state, action) => {
        state.requestStatus.unblockUser.loading = false;
        state.requestStatus.unblockUser.error = action.payload as string;
        state.error = action.payload as string;
      });

    // Assign Role
    builder
      .addCase(assignRoleThunk.pending, (state) => {
        state.requestStatus.assignRole.loading = true;
        state.requestStatus.assignRole.error = null;
        state.error = null;
      })
      .addCase(assignRoleThunk.fulfilled, (state, action) => {
        state.requestStatus.assignRole.loading = false;
        if (state.classroom) {
          const member = state.classroom.members.find(
            (m) => m.user._id === action.payload.data?.userId,
          );
          if (member) {
            member.role = "co_admin";
          }
        }
      })
      .addCase(assignRoleThunk.rejected, (state, action) => {
        state.requestStatus.assignRole.loading = false;
        state.requestStatus.assignRole.error = action.payload as string;
        state.error = action.payload as string;
      });

    // Remove Member
    builder
      .addCase(removeMemberThunk.pending, (state) => {
        state.requestStatus.removeMember.loading = true;
        state.requestStatus.removeMember.error = null;
        state.error = null;
      })
      .addCase(removeMemberThunk.fulfilled, (state, action) => {
        state.requestStatus.removeMember.loading = false;
        if (state.classroom) {
          const userId = action.payload.data?.userId;
          if (userId) {
            state.classroom.members = state.classroom.members.filter(
              (m) => m.user._id !== userId,
            );
            state.classroom.totalMembers -= 1;
          }
        }
      })
      .addCase(removeMemberThunk.rejected, (state, action) => {
        state.requestStatus.removeMember.loading = false;
        state.requestStatus.removeMember.error = action.payload as string;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCreateClassroomError,
  setJoinClassroomError,
  setLeaveClassroomError,
  setDeleteEventError,
  setUpdateEventError,
  setMarkEventAsPrepared,
} = classroomSlice.actions;

export default classroomSlice.reducer;
