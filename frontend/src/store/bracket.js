import { createSlice } from "@reduxjs/toolkit";

const bracketSlice = createSlice({
    name: 'bracket',
    initialState: {
        brackets: [],
    },
    reducers: {
        setBracket(state, action) {

            console.log('action', action.payload);
    
            state.brackets = action.payload.brackets
        
        },
       
        clearBracket(state) {
            state.brackets = []
        },
    }
})

export const { setBracket, clearBracket } = bracketSlice.actions;

export default bracketSlice.reducer;