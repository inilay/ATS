const API_SERVER = "http://127.0.0.1:8000/api/v1"


const auxiliaryApi = {
    sendFeedback: async (api, responseBody) => {
        const response = await api.post(`${API_SERVER}/create_report/`, responseBody, {
            validateStatus: function (status) {
                    return status == 201;
                },
            })
        return  response
    },

    getAllGames: async (api) => {
      
        const response = await api.get(`${API_SERVER}/games/`)
        return  response

    }
    
}

export default auxiliaryApi