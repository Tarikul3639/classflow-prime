import { createAsyncThunk } from "@reduxjs/toolkit";
import { IEvent } from "@/redux/slices/classroom/types";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/utils/error.utils";

interface UpdateEventPayload {
  classroomId: string;
  eventId: string;
  eventData: Omit<
    IEvent,
    "_id" | "createdAt" | "updatedAt" | "createdBy" | "classroomId"
  >;
}

export const updateEventThunk = createAsyncThunk<
  IEvent, // fulfilled returns the updated event
  UpdateEventPayload, // thunk argument
  { rejectValue: string } // rejected returns string error
>(
  "classroom/updateEvent",
  async ({ classroomId, eventId, eventData }, { rejectWithValue }) => {
    try {
      const sanitizedEventData = {
        ...eventData,
        materials: eventData.materials?.map(({ _id, ...rest }) => rest),
      };
      const response = await apiClient.patch<{ event: IEvent }>(
        `/classrooms/${classroomId}/events/${eventId}`,
        sanitizedEventData,
        { withCredentials: true },
      );

      if (!response.data || !response.data.event)
        throw new Error("Failed to update event");

      return response.data.event;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);
