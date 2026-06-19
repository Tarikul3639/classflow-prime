import { createSlice } from "@reduxjs/toolkit";
import {
    fetchClassMembers,
    assignAssistant,
    revokeAssistant,
    revokeMember,
    type ClassMember,
    EnrollmentRole,
} from "../../thunks/members/class-member.thunk";

// ─── Bucket Interface ───────────────────────────────────────────────
interface ClassBucket {
    members: ClassMember[];
    lastFetched: number;

    fetchMembers: {
        loading: boolean;
        error: string | null;
        isFetched: boolean;
    };
}

// ─── State Interface ────────────────────────────────────────────────
export interface ClassMembersState {
    membersByClass: {
        [classId: string]: ClassBucket;
    };
}

// ─── Factory ────────────────────────────────────────────────────────
const createInitialClassBucket = (): ClassBucket => ({
    members: [],
    lastFetched: 0,

    fetchMembers: {
        loading: false,
        isFetched: false,
        error: null,
    },
});

// ─── Initial State ──────────────────────────────────────────────────
const initialState: ClassMembersState = {
    membersByClass: {},
};

// ─── Slice ──────────────────────────────────────────────────────────
const classMemberSlice = createSlice({
    name: "classMembers",
    initialState,

    reducers: {},

    extraReducers: (builder) => {
        builder

            // ─── Fetch Members ───────────────────────────────────────────

            .addCase(fetchClassMembers.pending, (state, action) => {
                const classId = action.meta.arg;

                if (!state.membersByClass[classId]) {
                    state.membersByClass[classId] = createInitialClassBucket();
                }

                state.membersByClass[classId].fetchMembers.loading = true;
                state.membersByClass[classId].fetchMembers.isFetched = false;
                state.membersByClass[classId].fetchMembers.error = null;
            })

            .addCase(fetchClassMembers.fulfilled, (state, action) => {
                const { classId, members } = action.payload;

                if (!state.membersByClass[classId]) {
                    state.membersByClass[classId] = createInitialClassBucket();
                }

                state.membersByClass[classId].members = members;
                state.membersByClass[classId].lastFetched = Date.now();

                state.membersByClass[classId].fetchMembers.loading = false;
                state.membersByClass[classId].fetchMembers.isFetched = true;
                state.membersByClass[classId].fetchMembers.error = null;
            })

            .addCase(fetchClassMembers.rejected, (state, action) => {
                const classId = action.meta.arg;

                if (!state.membersByClass[classId]) {
                    state.membersByClass[classId] = createInitialClassBucket();
                }

                state.membersByClass[classId].fetchMembers.loading = false;
                state.membersByClass[classId].fetchMembers.isFetched = true;
                state.membersByClass[classId].fetchMembers.error =
                    action.payload?.message || "Failed to fetch class members";
            })

            // ─── Assign Assistant ────────────────────────────────────────

            .addCase(assignAssistant.fulfilled, (state, action) => {
                const { userId, classId } = action.payload;

                const member = state.membersByClass[classId]?.members.find(
                    (m) => m.userId === userId
                );

                if (member) {
                    member.role = EnrollmentRole.ASSISTANT;
                }
            })

            // ─── Revoke Assistant ────────────────────────────────────────

            .addCase(revokeAssistant.fulfilled, (state, action) => {
                const { userId, classId } = action.payload;

                const member = state.membersByClass[classId]?.members.find(
                    (m) => m.userId === userId
                );

                if (member) {
                    member.role = EnrollmentRole.LEARNER;
                }
            })

            // ─── Revoke Member ───────────────────────────────────────────

            .addCase(revokeMember.fulfilled, (state, action) => {
                const { userId, classId } = action.payload;

                const members = state.membersByClass[classId]?.members;

                if (members) {
                    state.membersByClass[classId].members = members.filter(
                        (m) => m.userId !== userId
                    );
                }
            });
    },
});

export default classMemberSlice.reducer;