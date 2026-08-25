import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/api/axios";
import { isAxiosError } from "axios";
import type { Comments } from "@/types/update.types";

interface CreateClassUpdateCommentArgs {
    classId: string;
    updateId: string;
    message: string;
}

interface CreateClassUpdateCommentResponse {
    success: boolean;
    message: string;
    data: {
        comment: Comments;
    };
}

export const createClassUpdateComment = createAsyncThunk<
    Comments,
    CreateClassUpdateCommentArgs,
    { rejectValue: { message: string } }
>(
    "classes/createClassUpdateComment",
    async ({ classId, updateId, message }, { rejectWithValue }) => {
        try {
            const trimmedMessage = message.trim();

            if (!trimmedMessage) {
                return rejectWithValue({
                    message: "Comment cannot be empty.",
                });
            }

            const { data } =
                await apiClient.post<CreateClassUpdateCommentResponse>(
                    `/classes/${classId}/updates/${updateId}/comments`,
                    {
                        message: trimmedMessage,
                    }
                );

            if (!data.success) {
                return rejectWithValue({
                    message: data.message || "Failed to create comment.",
                });
            }

            return data.data.comment;
        } catch (error: unknown) {
            let errorMessage =
                "An error occurred while creating the comment.";

            if (isAxiosError(error)) {
                errorMessage =
                    error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            return rejectWithValue({
                message: errorMessage,
            });
        }
    }
);