import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/api/axios";
import { isAxiosError } from "axios";

interface DeleteCommentFromUpdateArgs {
    classId: string;
    updateId: string;
    commentId: string;
}

interface DeleteCommentFromUpdateData {
    commentId: string;
}

interface DeleteCommentFromUpdateResponse {
    success: boolean;
    message: string;
    data: DeleteCommentFromUpdateData;
}

export const deleteCommentFromUpdate = createAsyncThunk<
    DeleteCommentFromUpdateData,
    DeleteCommentFromUpdateArgs,
    { rejectValue: { message: string } }
>(
    "classes/deleteCommentFromUpdate",
    async (
        { classId, updateId, commentId },
        { rejectWithValue }
    ) => {
        try {
            const { data } =
                await apiClient.delete<DeleteCommentFromUpdateResponse>(
                    `/classes/${classId}/updates/${updateId}/comments/${commentId}`
                );

            if (!data.success) {
                return rejectWithValue({
                    message:
                        data.message || "Failed to delete the comment.",
                });
            }

            return data.data;
        } catch (error: unknown) {
            let errorMessage =
                "An error occurred while deleting the comment.";

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