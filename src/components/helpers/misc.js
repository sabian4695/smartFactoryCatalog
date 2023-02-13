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

export const readFileData = file => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = e => rej(e);
    reader.readAsDataURL(file);
});

export const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
        }
    });
}

export const resizeImage = (base64Str, maxWidth , maxHeight ) => {
    return new Promise((resolve) => {
        let img = new Image()
        img.src = base64Str
        img.onload = () => {
            let canvas = document.createElement('canvas')
            const MAX_WIDTH = maxWidth
            const MAX_HEIGHT = maxHeight
            let width = img.width
            let height = img.height

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width
                    width = MAX_WIDTH
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height
                    height = MAX_HEIGHT
                }
            }
            canvas.width = width
            canvas.height = height
            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)
            resolve(canvas.toDataURL())
        }
    })
}