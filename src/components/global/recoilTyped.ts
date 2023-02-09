import {atom} from 'recoil'

export interface itemType {
    recordId: string,
    title: string,
    status: string,
    imgURL: string,
    webLink: string | null,
    reportLink: string | null,
    description: string,
    details: string,
    unitAdoption: string[],
    department: string | null,
    org: string | null,
    typeAvailable: string[],
    createdDate: number,
    releasedDate: number | null,
}

export interface cartItem {
    id: string,
    title: string,
}

export const cartItems = atom({
    key: "cartItems",
    default: [] as cartItem[],
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