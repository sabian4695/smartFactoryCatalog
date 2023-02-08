import {atom} from 'recoil'
import materialPurchasingTool from "../../images/materialPurchasingTool.png";

export interface itemType {
    recordId: string,
    longTitle: string,
    shortTitle: string,
    status: string,
    imgURL: string,
    link: string | null,
    description: string,
    details: string,
    unitAdoption: string[] | null,
    department: string | null,
    org: string | null,
    createdDate: number,
}

export const catalogList = atom({
    key: "catalogList",
    default: [] as itemType[],
});