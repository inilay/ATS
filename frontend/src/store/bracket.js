import { createSlice } from "@reduxjs/toolkit";

const bracketSlice = createSlice({
    name: 'bracket',
    initialState: {
        brackets: [],
        currentMatch: null
    },
    reducers: {
        setBracket(state, action) {

            console.log('action', action.payload);
    
            state.brackets = action.payload.brackets
        
        },
        setCurrentMatch(state, action) {
            state.currentMatch = action.payload.currentMatch
        },
        clearBracket(state) {
            state.brackets = []
            state.currentMatch = {}
        },
    }
})

export const { setBracket, clearBracket, setCurrentMatch } = bracketSlice.actions;

export default bracketSlice.reducer;