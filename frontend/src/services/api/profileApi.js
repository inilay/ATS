import { API_SERVER } from "../../Variables";

const profileApi = {
    getProfileBySlug: async (api, slug) => {
        const response = await api.get(`${API_SERVER}/profile/${slug}/`);
        return response;
    },

    getSubscriptionsBySlug: async (api) => {
        const response = await api.get(`${API_SERVER}/get_subscriptions/`);

        return response;
    },

    createSubscription: async (api, data) => {
        const response = await api.post(`${API_SERVER}/create_subscription/`, data);
        return response;
    },

    deleteSubscription: async (api, data) => {
        const response = await api.delete(`${API_SERVER}/delete_subscription/`, data);
        return response;
    },

    updateProfiIcon: async (api, slug, data) => {
        const response = api.patch(`/img_change/${slug}/`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    },

    changePassword: async (api, data) => {
        const response = api.post("/password_change/", data);
        return response;
    },

    resetPassword: async (api, responseBody) => {
        const response = await api.post(`${API_SERVER}/password_reset/`, responseBody);

        return response;
    },

    resetPasswordConfirm: async (api, responseBody) => {
        const response = await api.post(`${API_SERVER}/password_reset_confirm/`, responseBody);

        return response;
    },
};

export default profileApi;
