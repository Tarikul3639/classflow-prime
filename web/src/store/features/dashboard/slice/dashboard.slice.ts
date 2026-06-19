import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardData } from "../../dashboard/thunk/dashboard.thunk";
import {
    DashboardClassItem,
    DashboardFacultyItem,
    DashboardGroupItem,
    DashboardUpdateItem,
} from "../dashboard.types";

// ─── State ────────────────────────────────────────────────────────────────────

interface DashboardState {
    classes: DashboardClassItem[];
    updates: DashboardUpdateItem[];
    faculty: DashboardFacultyItem[];
    groups: DashboardGroupItem[];
    loading: {
        fetchDashboard: boolean;
    };
    isFetched: {
        fetchDashboard: boolean;
    };
    error: {
        fetchDashboard: string | null;
    };
}

const initialState: DashboardState = {
    classes: [],
    updates: [],
    faculty: [],
    groups: [],
    loading: {
        fetchDashboard: false,
    },
    error: {
        fetchDashboard: null,
    },
    isFetched: {
        fetchDashboard: false,
    }
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        // Optimistic pin toggle — flips isPinned instantly without an API call
        togglePinUpdate(state, action: { payload: string }) {
            const update = state.updates.find((u) => u._id === action.payload);
            if (update) update.isPinned = !update.isPinned;
        },

        resetDashboard() {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading.fetchDashboard = true;
                state.error.fetchDashboard = null;
                state.isFetched.fetchDashboard = false;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading.fetchDashboard = false;
                state.isFetched.fetchDashboard = true;

                // Guard against null/undefined payload from the API
                if (!action.payload) return;

                state.classes = action.payload.classes ?? [];
                state.updates = action.payload.updates ?? [];
                state.faculty = action.payload.faculty ?? [];
                state.groups  = action.payload.groups  ?? [];
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading.fetchDashboard = false;
                state.error.fetchDashboard =
                    action.payload?.message || "Failed to load dashboard";
                state.isFetched.fetchDashboard = true;
            });
    },
});

export const { togglePinUpdate, resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;