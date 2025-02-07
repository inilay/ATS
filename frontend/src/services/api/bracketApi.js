const API_SERVER = "http://127.0.0.1:8000/api/v1"


const bracketApi = {
    getBracket: async (api, id) => {api.get(`${API_SERVER}/bracket/${id}`)},
    getBrackets: async (api, id) =>  api.get(`${API_SERVER}/tournament_brackets/${id}/`),
    updateBracket: async (api, data) =>  api.put(`${API_SERVER}/update_bracket/`, data),
    createBracket: async (api, responseBody) => {
        const response = await api.post(`${API_SERVER}/create_bracket/`, responseBody, {
        validateStatus: function (status) {
                return status == 201;
            },
        })
        return  response
    },
    
}

export default bracketApi