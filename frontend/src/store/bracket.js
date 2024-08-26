import { createSlice } from "@reduxjs/toolkit";

const bracketSlice = createSlice({
    name: 'bracket',
    initialState: {
        id: '',
        bracket: '',
    },
    reducers: {
        setBracket(state, action) {
            state.id = action.payload.id
            state.bracket = action.payload.bracket
        
        },
       
        clearBracket(state) {
            state.id = ''
            state.bracket = ''
        },
    }
})

export const { setBracket, clearBracket } = bracketSlice.actions;

export default bracketSlice.reducer;