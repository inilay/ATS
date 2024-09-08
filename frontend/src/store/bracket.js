import { createSlice } from "@reduxjs/toolkit";

const bracketSlice = createSlice({
    name: 'bracket',
    initialState: {
        brackets: [],
        currentMatch: null,
        currentBracketId: null
    },
    reducers: {
        setBracket(state, action) {

            console.log('action', action.payload);
    
            state.brackets = action.payload.brackets
        
        },
        setCurrentMatch(state, action) {
            state.currentMatch = action.payload.currentMatch
        },
        setCurrentBracketId(state, action) {
            state.currentBracketId = action.payload.currentBracketId
        },
        clearBracket(state) {
            state.brackets = []
            state.currentBracketId = null
            state.currentMatch = null
        },
    }
})

export const { setBracket, clearBracket, setCurrentMatch, setCurrentBracketId } = bracketSlice.actions;

export default bracketSlice.reducer;