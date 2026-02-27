import { createAsyncThunk } from "@reduxjs/toolkit";
import { IEvent } from "@/redux/slices/classroom/types";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/utils/error.utils";

interface CreateEventPayload {
  classroomId: string;
  eventData: Omit<
    IEvent,
    "_id" | "createdAt" | "updatedAt" | "createdBy" | "classroomId"
  >; // frontend sends data except these fields
}

export const createEventThunk = createAsyncThunk<
  IEvent, // 1️⃣ Return type of the thunk
  CreateEventPayload, // 2️⃣ Argument type for the thunk
  { rejectValue: string } // 3️⃣ optional → rejectValue type
>(
  "classroom/createEvent",
  async ({ classroomId, eventData }, { rejectWithValue }) => {
    try {
      const sanitizedEventData = {
        ...eventData,
        materials: eventData.materials?.map(({ _id, ...rest }) => rest),
      };
      console.log("Creating event with data:", sanitizedEventData);
      const response = await apiClient.post<{ event: IEvent }>(
        `/classrooms/${classroomId}/events`,
        sanitizedEventData,
        { withCredentials: true },
      );

      return response.data.event;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);
