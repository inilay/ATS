import { createSlice } from "@reduxjs/toolkit";

const tournamentSlice = createSlice({
    name: 'tournament',
    initialState: {
        id: '',
        link: '',
        title: '',
        content: '',
        owner: '',
        startTime: '',
        poster: '', 
        game: '',
    },
    reducers: {
        setTournament(state, action) {
            state.id = action.payload.id
            state.link = action.payload.link
            state.title = action.payload.title
            state.content = action.payload.content
            state.owner = action.payload.owner
            state.startTime = action.payload.startTime
            state.poster = action.payload.poster
            state.game = action.payload.game
        },
       
        clearTournament(state) {
            state.id = ''
            state.link = ''
            state.title = ''
            state.content = ''
            state.owner = ''
            state.startTime = ''
            state.poster = ''
            state.game = ''
        },
    }
})

export const { setTournament, clearTournament } = tournamentSlice.actions;

export default tournamentSlice.reducer;