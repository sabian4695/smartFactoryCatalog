import { STORAGE_KEY_PREFIX } from './config';

export const storeData = (key, data) => localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, data);
export const deleteData = key => localStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
export const getDataString = key => localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
export const getDataInt = key => {
    const strData = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    const intData = strData != null ? parseInt(strData, 10) : null;
    return intData != null && !isNaN(intData) ? intData : null;
};