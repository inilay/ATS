import useAxios from "./useAxios";
import axios from "axios";
const baseURL = "http://127.0.0.1:8000/api/v1";

export default class PostService {
    // static async sendFeedback(responseBody) {
    //     const response = await axios.post(`${baseURL}/create_report/`, responseBody, {
    //         validateStatus: function (status) {
    //                 return status == 201;
    //             },
    //         })
    //     return  response
    // }
    // static async getAllTournaments(limit=12, page=1, title="", game="") {
    //     const response = await axios.get(`${baseURL}/tournaments/`,
    //     {params: {
    //         limit: limit,
    //         offset: (page-1)*limit,
    //         title: title,
    //         game: game
    //     }})
    //     return  response
    // }
    // static async getAllGames() {
    //     const response = await axios.get(`${baseURL}/games/`)
    //     return  response
    // }
    // static async getTournamentBySlug(slug) {
    //     const response = await axios.get(`${baseURL}/tournament/${slug}/`)
    //     return  response
    // }
    // static async createTournament(responseBody) {
    //     const response = await axios.post(`${baseURL}/create_tournament/`, responseBody, {
    //         validateStatus: function (status) {
    //                 return status == 201;
    //             },
    //         })
    //     return  response
    // }
    // static async getProfileBySlug(slug) {
    //     const response = await axios.get(`${baseURL}/profile/${slug}/`)
    //     return  response
    // }
    // static async getBracketById(id) {
    //     const response = await axios.get(`${baseURL}/bracket/${id}/`)
    //     return  response
    // }
    // static async createBracket(responseBody) {
    //     const response = await axios.post(`${baseURL}/create_bracket/`, responseBody, {
    //     validateStatus: function (status) {
    //             return status == 201;
    //         },
    //     })
    //     return  response
    // }
    // static async allTournamentBrackets(slug) {
    //     const response = await axios.get(`${baseURL}/tournament_brackets/${slug}/`)
    //     return  response
    // }
    // static async resetPassword(responseBody) {
    //     const response = await axios.post(`${baseURL}/password_reset/`, responseBody)
    //     return  response
    // }
    // static async resetPasswordConfirm(responseBody) {
    //     const response = await axios.post(`${baseURL}/password_reset_confirm/`, responseBody)
    //     return  response
    // }
}
