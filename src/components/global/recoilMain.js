import {atom, selector} from "recoil";
import {loggingEffect, saveToStorageEffect, updateLastActivityEffect} from '../helpers/misc'
import cloneDeep from 'lodash.clonedeep';

let defaultTheme
if (localStorage.getItem('themeMode') !== null) {
    let def = localStorage.getItem('themeMode')
    defaultTheme = def === null ? 'light' : def
} else {
    defaultTheme = 'light'
    localStorage.setItem('themeMode','light')
}

export const themeMode = atom({
    key: "themeMode",
    default: defaultTheme,
});

export const categoryOpen = atom({
    key: "categoryOpen",
    default: false,
});

export const categoryItem = atom({
    key: "categoryItem",
    default: 'defaultString',
});

export const addCategoryOpen = atom({
    key: "addCategoryOpen",
    default: false,
});

export const editCatagoryOpen = atom({
    key: "editCatagoryOpen",
    default: false,
});

export const snackBarText = atom({
    key: "snackBarText",
    default: 'message',
});

export const snackBarSeverity = atom({
    key: "snackBarSeverity",
    default: "success",
});

export const snackBarOpen = atom({
    key: "snackBarOpen",
    default: false,
});

export const filterDrawerOpen = atom({
    key: "filterDrawerOpen",
    default: false,
});

export const areYouSure = atom({
    key: "areYouSure",
    default: false,
});

export const areYouSureTitle = atom({
    key: "areYouSureTitle",
    default: 'Title',
});

export const areYouSureDetails = atom({
    key: "areYouSureDetails",
    default: 'Details',
});

export const areYouSureAccept = atom({
    key: "areYouSureAccept",
    default: false,
});

export const loadingTitle = atom({
    key: 'loadingTitle',
    default: '',
})
export const loadingOpen = atom({
    key: 'loadingOpen',
    default: false,
})

export const loadingMessageStackAtom = atom({
    key: 'loadingMessageStack',
    default: [],
    effects_UNSTABLE: [loggingEffect('loadingMessageStack')],
});

export const loadingMessageSelector = selector({
    key: 'loadingMessage',
    get: ({get}) => {
        const messageStack = get(loadingMessageStackAtom);
        return messageStack.length ? messageStack[0] : null;
    },
    set: ({get, set}, newValue) => {
        const messageStack = cloneDeep(get(loadingMessageStackAtom));
        if (newValue != null) messageStack.push(newValue);
        else messageStack.shift();
        set(loadingMessageStackAtom, messageStack);
    },
});

export const accessTokenAtom = atom({
    key: 'accessToken',
    default: null,
    effects_UNSTABLE: [
        loggingEffect('accessToken'),
        saveToStorageEffect('accessToken'),
    ],
});

export const refreshTokenAtom = atom({
    key: 'refreshToken',
    default: null,
    effects_UNSTABLE: [
        loggingEffect('refreshToken'),
        saveToStorageEffect('refreshToken'),
    ],
});

export const refreshExpiryAtom = atom({
    key: 'refreshExpiry',
    default: null,
    effects_UNSTABLE: [
        loggingEffect('refreshExpiry'),
        saveToStorageEffect('refreshExpiry'),
    ],
});

export const accessExpiryAtom = atom({
    key: 'accessExpiry',
    default: null,
    effects_UNSTABLE: [
        loggingEffect('accessExpiry'),
        saveToStorageEffect('accessExpiry'),
    ],
});

export const userIdAtom = atom({
    key: 'userId',
    default: null,
    effects_UNSTABLE: [
        loggingEffect('userId'),
        saveToStorageEffect('userId'),
        updateLastActivityEffect(),
    ],
});

export const loggedInUserAtom = atom({
    key: 'loggedInUser',
    default: null,
    effects_UNSTABLE: [
        loggingEffect('loggedInUser'),
        saveToStorageEffect('loggedInUser'),
    ],
});

export const lastActivityAtom = atom({
    key: 'lastActivity',
    default: null,
    effects_UNSTABLE: [loggingEffect('lastActivity')],
});
