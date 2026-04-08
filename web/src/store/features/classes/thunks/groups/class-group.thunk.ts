import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/api/axios";
import { extractAxiosError } from "@/api/extract-error";
import { ClassGroup, GroupErrorFieldType, GroupErrorField } from "@/types/group.types";
import type { ApiError } from "@/api/extract-error";
import { mapToApiError } from "@/api/extract-error";

// ─── Interfaces ────────────────────────────────────────────────────────────

interface FetchClassGroupsData {
    classId: string;
    groups: ClassGroup[];
}

interface FetchClassGroupsResponse {
    success: boolean;
    message: string;
    data: FetchClassGroupsData;
}

interface CreateClassGroupResponse {
    success: boolean;
    message: string;
    data: {
        group: ClassGroup;
    };
}

interface UpdateClassGroupResponse {
    success: boolean;
    message: string;
    data: {
        group: ClassGroup;
    };
}

interface DeleteClassGroupResponse {
    success: boolean;
    message: string;
    data: {
        groupId: string;
    };
}

interface FetchSingleGroupResponse {
    success: boolean;
    message: string;
    data: {
        group: ClassGroup;
    };
}

// ─── Payload Types ────────────────────────────────────────────────────────

export interface CreateClassGroupPayload {
    classId: string;
    groupData: Omit<
        ClassGroup,
        "groupId" | "createdAt" | "updatedAt" | "createdBy"
    >;
}

export interface UpdateClassGroupPayload {
    classId: string;
    groupId: string;
    groupData: Partial<
        Omit<ClassGroup, "groupId" | "createdAt" | "updatedAt">
    >;
}

export interface DeleteClassGroupPayload {
    classId: string;
    groupId: string;
}

export interface FetchSingleGroupPayload {
    classId: string;
    groupId: string;
}

// ─── Thunks ───────────────────────────────────────────────────────────────

/**
 * Fetch All Class Groups for a specific class
 * Normalized by classId to prevent data collision
 */
export const fetchClassGroups = createAsyncThunk<
    FetchClassGroupsData,
    string, // classId as argument
    { rejectValue: string }
>("classes/fetchGroups", async (classId, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.get<FetchClassGroupsResponse>(
            `classes/${classId}/groups`
        );
        return data.data; // { classId, groups: [...] }
    } catch (error) {
        return rejectWithValue(extractAxiosError(error));
    }
});

/**
 * Fetch Single Class Group
 * Used in group details/edit page to get the latest data
 */
export const fetchSingleClassGroup = createAsyncThunk<
    ClassGroup,
    FetchSingleGroupPayload,
    { rejectValue: string }
>(
    "classes/fetchSingleGroup",
    async ({ classId, groupId }, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.get<FetchSingleGroupResponse>(
                `classes/${classId}/groups/${groupId}`
            );
            return data.data.group;
        } catch (error) {
            return rejectWithValue(extractAxiosError(error));
        }
    }
);

/**
 * Create Class Group
 */
export const createClassGroup = createAsyncThunk<
    ClassGroup,
    CreateClassGroupPayload,
    { rejectValue: ApiError<GroupErrorFieldType> }
>(
    "classes/createGroup",
    async ({ classId, groupData }, { rejectWithValue }) => {

        if (!groupData.link) {
            return rejectWithValue({
                message: "Please select a valid group link.",
                field: GroupErrorField.link,
            });
        }

        if (!groupData.platform) {
            return rejectWithValue({
                message: "Please select the platform of the group.",
                field: GroupErrorField.platform,
            });
        }

        if (!groupData.name) {
            return rejectWithValue({
                message: "Group name is required.",
                field: GroupErrorField.name,
            });
        }

        if (groupData.name && groupData.name.length > 50) {
            return rejectWithValue({
                message: "Group name cannot exceed 50 characters.",
                field: GroupErrorField.name,
            });
        }

        if (groupData.description && groupData.description.length > 300) {
            return rejectWithValue({
                message: "Group description cannot exceed 300 characters.",
                field: GroupErrorField.description,
            });
        }

        if (groupData.link && !/^https?:\/\/\S+$/.test(groupData.link)) {
            return rejectWithValue({
                message: "Please enter a valid URL for the group link.",
                field: GroupErrorField.link,
            });
        }

        try {
            const { data } = await apiClient.post<CreateClassGroupResponse>(
                `classes/${classId}/groups`,
                groupData
            );
            return data.data.group;
        } catch (error) {
            return rejectWithValue(mapToApiError(error));
        }
    }
);

/**
 * Update Class Group
 */
export const updateClassGroup = createAsyncThunk<
    ClassGroup,
    UpdateClassGroupPayload,
    { rejectValue: ApiError<GroupErrorFieldType> }
>(
    "classes/updateGroup",
    async ({ classId, groupId, groupData }, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.patch<UpdateClassGroupResponse>(
                `classes/${classId}/groups/${groupId}`,
                groupData
            );
            return data.data.group;
        } catch (error) {
            return rejectWithValue(mapToApiError(error));
        }
    }
);

/**
 * Delete Class Group
 */
export const deleteClassGroup = createAsyncThunk<
    { groupId: string },
    DeleteClassGroupPayload,
    { rejectValue: string }
>(
    "classes/deleteGroup",
    async ({ classId, groupId }, { rejectWithValue }) => {
        try {
            await apiClient.delete<DeleteClassGroupResponse>(
                `classes/${classId}/groups/${groupId}`
            );
            return { groupId };
        } catch (error) {
            return rejectWithValue(extractAxiosError(error));
        }
    }
);