import axios from "axios";
const API_SERVER = "http://127.0.0.1:8000/api/v1"

const bracketApi = {
    getBracket: async (id) => axios.get(`${API_SERVER}/bracket/${id}`),
    getBrackets: async (id) =>  axios.get(`${API_SERVER}/tournament_brackets/${id}/`),

    getPoList: async () => axios.get(`${API_SERVER}/api/po_list/`),
    getActionList: async (action_type) => axios.get(`${API_SERVER}/api/action_list/?action_type=${action_type}`),
    getUserList: async (page, filter) => axios.get(`${API_SERVER}/api/user_list/${page ? '?page=' + page : ''}${filter ? '&' + filter : ''}`),
    getUserActivityGraph: async (timeStep, filter) => axios.get(`${API_SERVER}/api/user_activity_graph/?time-step=${timeStep || 'week'}&${filter}`),
    getSignLogList: async (page, filter) => axios.get(`${API_SERVER}/api/sign_log_list/?page=${page}&${filter}`),
    getSignLogGraph: async (timeStep, filter) => axios.get(`${API_SERVER}/api/sign_log_graph/?time-step=${timeStep || 'week'}&${filter}`),
    getReregistrationLogList: async (page, filter) => axios.get(`${API_SERVER}/api/reregistration_log_list/?page=${page}&${filter}`),
    getReregistrationLogGraph: async (timeStep, filter) => axios.get(`${API_SERVER}/api/reregistration_log_graph/?time-step=${timeStep || 'week'}&${filter}`),
}

export default bracketApi