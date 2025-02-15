import { configureStore } from "@reduxjs/toolkit";
import bracketSlice from "./bracket";
import tournamentSlice from "./tournament";
import userSlice from "./user";

export default configureStore({
    reducer: {
        tournament: tournamentSlice,
        bracket: bracketSlice,
        user: userSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
