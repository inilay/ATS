import {configureStore} from '@reduxjs/toolkit'
import bracketSlice from './bracket';
import tournamentSlice from './tournament'


export default configureStore({
    reducer: {
        tournament: tournamentSlice,
        bracket: bracketSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware( {serializableCheck: false} )
});