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
        changeCurrentMatchInfo(state, action) {
            let _info = state.currentMatch.info
            _info.find(item => {
                if (item.id === action.payload.id) {
                    item.participant_score = action.payload.participant_score;
                    return true;
                }
            });
            state.currentMatch.info = _info
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

export const { setBracket, clearBracket, setCurrentMatch, setCurrentBracketId, changeCurrentMatchInfo } = bracketSlice.actions;

export default bracketSlice.reducer;