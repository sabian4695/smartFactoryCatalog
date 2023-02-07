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

export const getLocators = async (accessToken) => {
    const response = await axios.get(
        '/startup-checklist/locators',
        {
            headers: {
                'x-api-key': CONFIG.APP_API_KEY,
                Authorization: accessToken,
            },
            baseURL: BASE_URL
        },
    );
    return response?.data?.body ? JSON.parse(response.data.body) : response.data
}

export const getTableItemByRecordType = async (accessToken, recordType) => {
    const response = await axios.get(
        `/startup-checklist/${recordType}`,
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

export const createTableItem = async (accessToken, recordType, recordId, obj) => {
    const response = await axios.put(
        `/startup-checklist/${recordType}`,
        {recordType, recordId, obj},
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

export const deleteTableItem = async (accessToken, recordType, recordId) => {
    const response = await axios.delete(
        `/startup-checklist/${recordType}/${recordId}`,
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

export const getDownloadUrl = async (accessToken, recordType, recordId, filename) => {
    const response = await axios.get(
        `/startup-checklist/${recordType}/${recordId}/attachment/url`,
        {
            headers: {
                'x-api-key': CONFIG.APP_API_KEY,
                Authorization: accessToken,
            },
            params: {
                action: 'GET',
                description: filename,
                filename,
            },
            baseURL: BASE_URL,
        },
    );
    if(response.status !== 200) return;
    const data = response?.data?.body ? JSON.parse(response.data.body) : response.data;
    return data.url;
};

export const getUploadUrl = async (accessToken, recordType, recordId, filename, type) => {
    const response = await axios.get(
        `/startup-checklist/${recordType}/${recordId}/attachment/url`,
        {
            headers: {
                'x-api-key': CONFIG.APP_API_KEY,
                Authorization: accessToken,
            },
            params: {
                action: 'PUT',
                description: filename,
                type,
            },
            baseURL: BASE_URL,
        },
    );
    if (response.status !== 200) return;
    const data = response?.data?.body ? JSON.parse(response.data.body) : response.data;
    return data.url;
};

export const uploadAttachedDocument = async (url, fileData, fileType) => {
    const response = await axios.put(url, fileData, {headers: {'Content-Type': fileType}});
    return response.status === 200 ? response.data : null;
};

export const createAttachmentRecord = async (accessToken, fileName, recordId, fileType, userId, username) => {
    const response = await axios.post(
        `/startup-checklist/${fileName}/${recordId}/attachment`,
        {fileName, fileType, userId, username},
        {
            headers: {
                'x-api-key': CONFIG.APP_API_KEY,
                Authorization: accessToken,
            },
            baseURL: BASE_URL,
        },
    );
    if (response.status !== 200) return;
    return response?.data?.body ? JSON.parse(response.data.body) : response.data;
};

export const deletePhoto = async (accessToken, recordType, recordId, photoId) => {
    const response = await axios.delete(
        `/startup-checklist/${recordType}/${recordId}/attachment/${photoId}`,
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