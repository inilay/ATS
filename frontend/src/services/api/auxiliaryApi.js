import { API_SERVER } from "../../Variables";

const auxiliaryApi = {
    sendFeedback: async (api, responseBody) => {
        const response = await api.post(`${API_SERVER}/create_report/`, responseBody, {
            validateStatus: function (status) {
                return status == 201;
            },
        });
        return response;
    },

    getAllGames: async (api) => {
        const response = await api.get(`${API_SERVER}/games/`);
        console.log("response", response);

        return response;
    },
};

export default auxiliaryApi;
