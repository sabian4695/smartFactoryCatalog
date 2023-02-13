import axios from 'axios';
import * as CONFIG from './config';

const BASE_URL = `https://cd8ayajsq7.execute-api.us-west-2.amazonaws.com/${CONFIG.ENVIRONMENT_TYPE === 'PRODUCTION' ? 'prod' : 'dev'}`;

export const login = async (username, password) => {
    const response = await axios.post(
        '/login',
        {userType: CONFIG.AUTH_DEFAULT_USER_TYPE, username, password},
        {
            headers: {'x-api-key': CONFIG.APP_API_KEY},
            baseURL: BASE_URL,
        },
    );
    return response.status === 200 ? response.data : null;
};

export const refreshLogin = async (userId, refreshToken) => {
    const response = await axios.post(
        '/login',
        {userType: CONFIG.AUTH_DEFAULT_USER_TYPE, userId, refreshToken},
        {
            headers: {'x-api-key': CONFIG.APP_API_KEY},
            baseURL: BASE_URL,
        },
    );
    return response.status === 200 ? response.data : null;
};

export const getAppRoles = async (accessToken) => {
    const response = await axios.get(
        '/roles',
        {
            headers: {
                'x-api-key': CONFIG.APP_API_KEY,
                Authorization: accessToken,
            },
            baseURL: BASE_URL,
        },
    );
    return response?.data?.body ? JSON.parse(response.data.body) : response.data;
}

export const getCatalogItems = async (accessToken) => {
    const response = await axios.get(
        `/smart-factory-catalog/catalogs`,
        {
            headers: {
                'x-api-key': CONFIG.APP_API_KEY,
                Authorization: accessToken,
            },
            baseURL: BASE_URL
        },
    );
    return response?.data?.body ? JSON.parse(response?.data) : response?.data
}

export const createTableItem = async (accessToken, catalogId, woObject) => {
    const response = await axios.put(
        `/smart-factory-catalog/${catalogId}`,
        {catalogId, woObject},
        {
            headers: {
                'x-api-key': CONFIG.APP_API_KEY,
                Authorization: accessToken,
            },
            baseURL: BASE_URL,
        },
    );
    return response?.status === 200 ? response?.data : null;
}

export const deleteTableItem = async (accessToken, catalogId) => {
    const response = await axios.delete(
        `/smart-factory-catalog/${catalogId}`,
        {
            headers: {
                'x-api-key': CONFIG.APP_API_KEY,
                Authorization: accessToken,
            },
            baseURL: BASE_URL,
        },
    );
    if(response.status !== 200) return;
    return response?.data?.body ? JSON.parse(response?.data?.body) : response?.data;
};

export const getUploadUrl = async (accessToken, catalogId, type, action) => {
    const response = await axios.get(
        `/smart-factory-catalog/${catalogId}/photoUrl`,
        {
            headers: {
                'x-api-key': CONFIG.APP_API_KEY,
                Authorization: accessToken,
            },
            params: {
                action: action,
                type: action === 'PUT' ? type : null,
            },
            baseURL: BASE_URL,
        },
    );
    if (response.status !== 200) return;
    const data = response?.data?.body ? JSON.parse(response.data.body) : response.data;
    return data.url;
};

export const deletePhoto = async (accessToken, catalogId) => {
    const response = await axios.delete(
        `/smart-factory-catalog/${catalogId}/photoUrl`,
        {
            headers: {
                'x-api-key': CONFIG.APP_API_KEY,
                Authorization: accessToken,
            },
            baseURL: BASE_URL,
        },
    );
    if(response.status !== 200) return;
    return response?.data?.body ? JSON.parse(response.data.body) : response.data;
};

export const uploadAttachedDocument = async (url, fileData, fileType) => {
    const response = await axios.put(url, fileData, {headers: {'Content-Type': fileType}});
    return response.status === 200 ? response.data : null;
};