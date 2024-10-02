import { apiBaseUrl, apiPrefix } from '@/config';
import { isServer } from '@/utils';
import axiosInstance from 'axios';
import { get } from 'lodash';
import { toast } from 'react-toastify';

const axios = axiosInstance.create({
    baseURL: `${apiBaseUrl}${apiPrefix}`,
    withCredentials: true,
});

axios.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error),
);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const statusCode = get(error, 'response.status', 400);
        if (statusCode === 401) {
            const message = get(
                error,
                'response.data.message',
                'Unauthorized access, please log in again.',
            );
            if (!isServer()) {
                toast.error(message);
            }
            if (typeof window !== 'undefined') {
                window.location.href = '/sign-in';
            }
        }
        return Promise.reject(error);
    },
);

export default axios;
