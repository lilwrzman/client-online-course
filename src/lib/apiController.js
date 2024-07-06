import { PUBLIC_SERVER_PATH } from "$env/static/public"
import axios from 'axios';

const ApiController = {
    sendRequest({
        method = 'GET',
        endpoint,
        data = null,
        headers = { 'Content-Type': 'application/x-www-form-urlencoded' },
        authToken = null,
        onUploadProgress = null,
        responseType = 'json'
    }) {
        const config = {
            method,
            url: `${PUBLIC_SERVER_PATH}/api/${endpoint}`,
            data,
            headers: {
                ...headers,
                Authorization: authToken ? `Bearer ${authToken}` : null,
            },
            responseType,
            onUploadProgress
        };

        return axios(config).then(response => response.data);
    },
};

export default ApiController;