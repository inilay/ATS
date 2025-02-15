import { createSlice } from "@reduxjs/toolkit";

const bracketSlice = createSlice({
    name: "bracket",
    initialState: {
        brackets: [],
        anonymous: false,
        currentMatch: null,
        currentBracketId: null,
    },
    reducers: {
        setBracket(state, action) {
            state.brackets = action.payload.brackets;
        },
        setAnonymous(state, action) {
            state.anonymous = action.payload.anonymous;
        },
        changeBracket(state, action) {
            state.brackets = state.brackets.map((bracket) =>
                bracket.id === action.payload.bracket.id
                    ? { ...bracket, rounds: action.payload.bracket.rounds }
                    : bracket,
            );
        },
        setCurrentMatch(state, action) {
            state.currentMatch = action.payload.currentMatch;
        },
        changeCurrentMatchInfo(state, action) {
            let _info = state.currentMatch.info;
            _info.find((item) => {
                if (item.id === action.payload.id) {
                    item.participant_score = action.payload.participant_score;
                    return true;
                }
            });
            state.currentMatch.info = _info;
        },
        setCurrentBracketId(state, action) {
            state.currentBracketId = action.payload.currentBracketId;
        },
        clearBracket(state) {
            state.brackets = [];
            state.currentBracketId = null;
            state.currentMatch = null;
            state.anonymous = false;
        },
    },
});

export const {
    setBracket,
    setAnonymous,
    clearBracket,
    setCurrentMatch,
    setCurrentBracketId,
    changeCurrentMatchInfo,
    changeBracket,
} = bracketSlice.actions;

export default bracketSlice.reducer;
