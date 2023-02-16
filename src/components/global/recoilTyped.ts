import {atom} from 'recoil'
import {getDataString} from "../helpers/storage";

export interface itemType {
    recordId: string,
    title: string,
    status: string,
    imgURL: string,
    webLink: string | null,
    displayLink: string | null,
    reportLink: string | null,
    description: string,
    details: string,
    unitAdoption: string[],
    department: string[],
    org: string[],
    typeAvailable: string[],
    createdDate: number,
    releasedDate: number | null,
}

export interface cartItem {
    id: string,
    title: string,
}

export interface imgItem {
    id: string,
    img: string,
}

let defaultCart: cartItem[] = []
let localCart = getDataString('cart')
if (localCart !== null) {
    defaultCart = JSON.parse(localCart)
}

export const cartItems = atom({
    key: "cartItems",
    default: defaultCart,
});

const list: itemType[]  = []

export const catalogListAtom = atom({
    key: "catalogList",
    default: list,
});

export const filteredCatalog = atom({
    key: "filteredCatalog",
    default: list,
});

let defaultImgData: imgItem[] = []


export const imgData = atom({
    key: "imgData",
    default: defaultImgData,
});