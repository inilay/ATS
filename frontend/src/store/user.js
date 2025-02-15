import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        subscriptions: [],
    },
    reducers: {
        setUser(state, action) {},

        setTournamnetSubscriptions(state, action) {
            state.subscriptions = [...action.payload.subscriptions];
        },

        followTournament(state, action) {
            state.subscriptions = [...state.subscriptions, action.payload.subscriptions];
        },

        unFollowTournament(state, action) {
            state.subscriptions = state.subscriptions.filter((username) => username != action.payload.subscriptions);
        },

        clearUser(state) {},
    },
});

export const { setUser, setTournamnetSubscriptions, followTournament, unFollowTournament, clearUser } =
    userSlice.actions;

export default userSlice.reducer;
