import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createClassUpdate } from "../thunks/create-class-update.thunk";
import { CreateUpdateFormData } from "@/types/update.types";
import type { ApiError, UpdateErrorField } from "../class.types";

interface IRequestStatus {
    loading: boolean;
    success: boolean;
    message: string | null;
    error: ApiError;
}

interface CreateUpdateState extends IRequestStatus {
    formData: CreateUpdateFormData;
}

const initialState: CreateUpdateState = {
    formData: {
        category: "announcement", // Default type
        title: "",
        description: "",
        date:"",
        time:"",
        materials: [],
    },
    loading: false,
    success: false,
    message: null,
    error: {
        field: null,
        message: null,
    },
};

const createUpdateSlice = createSlice({
    name: "createClassUpdate",
    initialState,
    reducers: {
        // ফর্ম ডাটা আপডেট করার জন্য
        updateUpdateFormData: (state, action: PayloadAction<Partial<CreateUpdateFormData>>) => {
            state.formData = { ...state.formData, ...action.payload };

            // এডিট করার সময় স্পেসিফিক ফিল্ডের এরর ক্লিয়ার করা
            const updatedField = Object.keys(action.payload)[0] as keyof CreateUpdateFormData;
            if (state.error.field === updatedField) {
                state.error = { field: null, message: null };
            }
        },
        // ফর্ম রিসেট করার জন্য
        resetUpdateForm: (state) => {
            state.formData = initialState.formData;
            state.loading = false;
            state.success = false;
            state.message = null;
            state.error = { field: null, message: null };
        },
    },
    extraReducers: (builder) => {
        builder
            // প্যান্ডিং স্টেট
            .addCase(createClassUpdate.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.message = null;
                state.error = { field: null, message: null };
            })
            // সাকসেস স্টেট
            .addCase(createClassUpdate.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || "Update posted successfully";
                // সাকসেস হলে ফর্ম ডাটা রিসেট করতে পারেন
                state.formData = initialState.formData;
            })
            // রিজেক্টেড স্টেট
            .addCase(createClassUpdate.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = null;
                const payload = action.payload;

                state.error = {
                    field: (payload?.field as UpdateErrorField) || null,
                    message: payload?.message || "Failed to post update",
                };
            });
    },
});

export const { updateUpdateFormData, resetUpdateForm } = createUpdateSlice.actions;
export default createUpdateSlice.reducer;