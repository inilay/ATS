const API_SERVER = "http://127.0.0.1:8000/api/v1"


const profileApi = {
    getProfileBySlug: async (api, slug) => {

        const response = await api.get(`${API_SERVER}/profile/${slug}/`)
        return  response

    },

    getSubscriptionsBySlug: async (api, slug) => {

        const response = await api.get(`${API_SERVER}/get_subscriptions/${slug}/`)
        return  response

    },

    updateProfiIcon: async (api, slug, data) => {
        const response = api.patch(
            `/img_change/${slug}/`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
      )
      return response
    },

    changePassword: async (api, data) => {
        const response = api.post("/password_change/", data);
        return response
    },
    
    resetPassword: async (api, responseBody) => {

        const response = await api.post(`${API_SERVER}/password_reset/`, responseBody)

        return  response
    },

    resetPasswordConfirm: async (api, responseBody) => {

        const response = await api.post(`${API_SERVER}/password_reset_confirm/`, responseBody)

        return  response
    }
}

export default profileApi