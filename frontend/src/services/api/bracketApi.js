import { API_SERVER } from "../../Variables";

const bracketApi = {
    getBrackets: async (api, id) => api.get(`${API_SERVER}/tournament_brackets/${id}/`),
    getBracket: async (api, link) => {
        const response = await api.get(`${API_SERVER}/anonymous_bracket/${link}/`);
        return response;
    },
    updateAnonymousBracket: async (api, data) => api.put(`${API_SERVER}/update_anonymous_bracket/`, data),

    updateBracket: async (api, data) => api.put(`${API_SERVER}/update_bracket/`, data),
    createBracket: async (api, responseBody) => {
        const response = await api.post(`${API_SERVER}/create_anonymous_bracket/`, responseBody, {
            validateStatus: function (status) {
                return status == 201;
            },
        });
        return response;
    },
};

export default bracketApi;
