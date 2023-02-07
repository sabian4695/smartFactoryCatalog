import * as CONFIG from './config';
import {deleteData, storeData} from './storage';
import {lastActivityAtom} from '../global/recoilMain';
import {getRecoil, setRecoil} from 'recoil-nexus';

export const cmp = (a, b) => (a > b) - (a < b);

export const loggingEffect = name => ({onSet}) =>
    onSet((newValue, oldValue) =>
        CONFIG.ENVIRONMENT_TYPE === 'DEVELOPMENT' && console.log(name, '->', {newValue, oldValue}));

export const saveToStorageEffect = name => ({onSet}) =>
    onSet(newValue => {
        if (newValue != null) storeData(name, newValue);
        else deleteData(name);
    });

export const updateLastActivityEffect = () => ({onSet}) =>
    onSet(() => setRecoil(lastActivityAtom, Date.now()));

export const timeToLogout = timeout => {
    const now = Date.now();
    const lastActivity = getRecoil(lastActivityAtom);
    return lastActivity + timeout < now;
};

export const formatDate = (dateInput) => {
    let m = new Date(dateInput)
    m.setDate(m.getDate());
    return m.toLocaleString()
}

export const dateTime = (dateInput) => {
    let m = new Date(dateInput)
    return m.getTime()
}

export const formatDatePDF = (dateInput) => {
    let m = new Date(dateInput)
    m.setDate(m.getDate());
    let day = m.getDate();
    let month = m.getMonth() + 1;
    let year = m.getFullYear()
    return `${("0" + month).slice(-2)}-${("0" + day).slice(-2)}-${year}`
}

export const readFileData = file => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = e => rej(e);
    reader.readAsDataURL(file);
});

export const formatDateForPrint = (dateInput) => {
    let m = new Date(dateInput)
    m.setDate(m.getDate());
    let day = m.getDate();
    let month = m.getMonth() + 1;
    let year = m.getFullYear()
    return `${("0" + month).slice(-2)}/${("0" + day).slice(-2)}/${year}`
}