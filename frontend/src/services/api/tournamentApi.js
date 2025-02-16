import { API_SERVER } from "../../Variables";

const tournamentApi = {
    getAllTournaments: async (api, limit = 12, page = 1, title = "", game = "") => {
        const response = await api.get(`${API_SERVER}/tournaments/`, {
            params: {
                limit: limit,
                offset: (page - 1) * limit,
                title: title,
                game: game,
            },
        });
        return response;
    },
    getTournamentBySlug: async (api, slug) => {
        const response = await api.get(`${API_SERVER}/tournament/${slug}/`);
        return response;
    },
    createTournament: async (api, responseBody) => {
        const response = await api.post(`${API_SERVER}/create_tournament/`, responseBody, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            validateStatus: function (status) {
                return status == 201;
            },
        });
        return response;
    },

    createModerator: async (api, data) => api.post(`${API_SERVER}/create_moderator/`, data),
    deleteModerator: async (api, data) => api.delete(`${API_SERVER}/delete_moderator/`, data),
};

export default tournamentApi;
