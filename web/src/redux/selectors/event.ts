// src/redux/slices/classroom/selectors.ts
import { RootState } from "@/redux/store";
import { IEvent } from "@/redux/slices/classroom/types";

export const getCurrentEvent = (
  state: RootState,
  eventId: string,
): IEvent | null => {
  const classroom = state.classroom.classroom;
  if (!classroom) return null;
  const event = classroom.events.find((e) => e._id === eventId);
  return event || null;
};
