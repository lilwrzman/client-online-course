import axios from 'axios';

const ApiController = {
    sendRequest({
        method = 'GET',
        endpoint,
        data = null,
        headers = { 'Content-Type': 'application/x-www-form-urlencoded' },
        authToken = null,
    }) {
        const config = {
            method,
            url: `http://127.0.0.1:8000/api/${endpoint}`,
            data,
            headers: {
                ...headers,
                Authorization: authToken ? `Bearer ${authToken}` : null,
            },
        };

        return axios(config).then(response => response.data);
    },
};

export default ApiController;