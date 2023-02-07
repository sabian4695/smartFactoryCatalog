import {atom} from "recoil";

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