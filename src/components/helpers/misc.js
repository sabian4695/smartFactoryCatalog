// noinspection SpellCheckingInspection

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

let something = [
    {
        "appName": "GWH - Pass Thru No Repack",
        "department": [
            "Engineering",
            "Logistics"
        ],
        "appUrl": "http://10.130.2.224:8080/admin",
        "orgCode": [
            "CUU"
        ],
        "description": "LMPR link",
        "type": [
            "Application",
            "Data Tracking"
        ]
    },
    {
        "appName": "Chihuahua2 – Packing and Assemblies(R)",
        "department": [
            "Engineering",
            "Production"
        ],
        "appUrl": "http://10.106.205.75/client/login/",
        "orgCode": [
            "CNL",
            "CWH"
        ],
        "description": "LMPR link",
        "type": [
            "Application",
            "Data Tracking"
        ]
    },
    {
        "appName": "Video Updates - CWH-Training-Room",
        "department": [
            "Sales",
            "Design",
            "Planning",
            "Production",
            "Engineering",
            "Quality",
            "Tooling",
            "Logistics"
        ],
        "appUrl": "https://d3vblchdgxvk5.cloudfront.net/CWH-Training-Room",
        "orgCode": [
            "CWH"
        ],
        "description": "Employee Communication Display - CWH",
        "type": [
            "PI",
            "Video Updates"
        ]
    },
    {
        "appName": "MATERIAL CHANGE SCREEN - NAM-LVG-U05",
        "department": [
            "Engineering",
            "Production",
            "Planning",
            "Quality",
            "Tooling"
        ],
        "appUrl": "https://d3oqqcu9cgrwny.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-LVG-U05/MATERIAL",
        "orgCode": [
            "LVG"
        ],
        "description": "Material Change Screen for Unit 5",
        "type": [
            "PI",
            "Material Change Screen"
        ]
    },
    {
        "appName": "Mold Change Screen - NAM-SLB-U40-P02",
        "department": [
            "Planning",
            "Production"
        ],
        "appUrl": "https://d3oqqcu9cgrwny.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-SLB-U40-P02",
        "orgCode": [
            "SLB"
        ],
        "description": "Mold Change List for SLB Plant 2",
        "type": [
            "PI",
            "Mold Change"
        ]
    },
    {
        "appName": "Generic Black Screen - NAM-SLB-U40-P02-FLOOR",
        "department": [
            "Production"
        ],
        "appUrl": "https://d20y46xrkjaxww.cloudfront.net/?apiKey=ZSMWFFGLa17Tp9AkO00OB3FAPDKIGlYG0koGOI80&locators=NAM-SLB-U40-P02&typeFilters=DOWN,MATERIAL_DRYING_ALARM,MACHINE_MONITORS_ALARM,CAVITY_MISMATCH_ALARM,JOB_STATUS_ERROR_ALARM,LSL_MODE_ERROR,LSL_MISSED_LABEL_ALARM,MASTER_SETUP_ALARM,NO_CONCENTRATE_ALARM,MIN_CUSHION_ALARM,NO_WATER_FLOW_ALARM,DIVERTER_CHUTE_ALARM,HOTBOX_ERROR_ALARM,NO_CLEAN_POINT_ALARM,ROBOT_ERROR_ALARM&showMachineTotals=true&title=U40%20P02%20Floor",
        "orgCode": [
            "SLB"
        ],
        "description": "FLOOR black screen for SLB Plant 2",
        "type": [
            "PI",
            "Black Screen"
        ]
    },
    {
        "appName": "Generic Black Screen - NAM-CNL-U1-FLOOR",
        "department": [
            "Production"
        ],
        "appUrl": "https://d20y46xrkjaxww.cloudfront.net/?apiKey=ZSMWFFGLa17Tp9AkO00OB3FAPDKIGlYG0koGOI80&locators=NAM-CNL-U1&typeFilters=DOWN,JOB_STATUS_ERROR_ALARM,CAVITY_MISMATCH_ALARM,PRINTER_HALTED_ALARM,MATERIAL_DRYING_ALARM,MACHINE_MONITORS_ALARM,LSL_MODE_ERROR,LSL_MISSED_LABEL_ALARM,NO_JOB,NO_CONCENTRATE_ALARM,MIN_CUSHION_ALARM,NO_WATER_FLOW_ALARM,DIVERTER_CHUTE_ALARM,HOTBOX_ERROR_ALARM,NO_CLEAN_POINT_ALARM,ROBOT_ERROR_ALARM&showMachineTotals=true&title=U1%20Floor",
        "orgCode": [
            "CNL"
        ],
        "description": "FLOOR black screen for Unit 1",
        "type": [
            "PI",
            "Black Screen"
        ]
    },
    {
        "appName": "GWH - Repack Stations",
        "department": [
            "Engineering",
            "Logistics"
        ],
        "appUrl": "http://10.106.205.78:8080/login",
        "orgCode": [
            "CWH"
        ],
        "description": "LMPR link",
        "type": [
            "Application",
            "Data Tracking"
        ]
    },
    {
        "appName": "Generic Black Screen - NAM-CNL-ENG",
        "department": [
            "Engineering"
        ],
        "appUrl": "https://d20y46xrkjaxww.cloudfront.net/?apiKey=ZSMWFFGLa17Tp9AkO00OB3FAPDKIGlYG0koGOI80&locators=NAM-CNL-U1,NAM-CNL-U18&typeFilters=DOWN,DOWN_PLANNED,MACHINE_MONITORS_ALARM,MSV_MISSING_SETUP_ALARM,CAVITY_MISMATCH_ALARM,MIN_CUSHION_ALARM,MASTER_SETUP_ALARM&downTypeFilters=ENGINEERING,PRE-PROD_SAMPLE&showMachineTotals=true&title=CNL%20Eng",
        "orgCode": [
            "CNL"
        ],
        "description": "ENGINEERING black screen for CNL",
        "type": [
            "PI",
            "Black Screen"
        ]
    },
    {
        "appName": "AQ Screen - NAM-CNL-U18",
        "department": [
            "Production"
        ],
        "appUrl": "https://d1t78nn709oakl.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-CNL-U18",
        "orgCode": [
            "CNL"
        ],
        "description": "Availability & Quality Screen for Unit 18 Molding",
        "type": [
            "PI",
            "AQ Screen"
        ]
    },
    {
        "appName": "AQ Screen - NAM-CNL-U1",
        "department": [
            "Production"
        ],
        "appUrl": "https://d1t78nn709oakl.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-CNL-U1",
        "orgCode": [
            "CNL"
        ],
        "description": "Availability & Quality Screen for Unit 1",
        "type": [
            "PI",
            "AQ Screen"
        ]
    },
    {
        "appName": "Generic Black Screen - NAM-SLB-U40-P03-FLOOR",
        "department": [
            "Production"
        ],
        "appUrl": "https://d20y46xrkjaxww.cloudfront.net/?apiKey=ZSMWFFGLa17Tp9AkO00OB3FAPDKIGlYG0koGOI80&locators=NAM-SLB-U40-P03&typeFilters=DOWN,MATERIAL_DRYING_ALARM,JOB_STATUS_ERROR_ALARM,CAVITY_MISMATCH_ALARM,MACHINE_MONITORS_ALARM,LSL_MODE_ERROR,LSL_MISSED_LABEL_ALARM,NO_JOB,NO_CONCENTRATE_ALARM,MIN_CUSHION_ALARM,NO_WATER_FLOW_ALARM,DIVERTER_CHUTE_ALARM,MASTER_SETUP_ALARM,HOTBOX_ERROR_ALARM,NO_CLEAN_POINT_ALARM,ROBOT_ERROR_ALARM&showMachineTotals=true&title=U40%20P03%20Floor",
        "orgCode": [
            "SLB"
        ],
        "description": "FLOOR black screen for SLB Plant 3",
        "type": [
            "PI",
            "Black Screen"
        ]
    },
    {
        "appName": "MATERIAL CHANGE SCREEN - NAM-SLB-U40-P02",
        "department": [
            "Engineering",
            "Production",
            "Planning",
            "Quality",
            "Tooling"
        ],
        "appUrl": "https://d3oqqcu9cgrwny.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-SLB-U40-P02/MATERIAL",
        "orgCode": [
            "SLB"
        ],
        "description": "Material Change Screen for Unit 40 Plant 2",
        "type": [
            "PI",
            "Material Change Screen"
        ]
    },
    {
        "appName": "Mold Change Screen - NAM-LVG-U05",
        "department": [
            "Planning",
            "Production"
        ],
        "appUrl": "https://d3oqqcu9cgrwny.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-LVG-U05",
        "orgCode": [
            "LVG"
        ],
        "description": "Mold Change List for Unit 5",
        "type": [
            "PI",
            "Mold Change"
        ]
    },
    {
        "appName": "Video Updates - ITDevKioskPiVideo",
        "department": [
            "Sales",
            "Design",
            "Planning",
            "Production",
            "Engineering",
            "Quality",
            "Tooling",
            "Logistics"
        ],
        "appUrl": "https://d3vblchdgxvk5.cloudfront.net/ITDevKioskPiVideo",
        "orgCode": [
            "CNL"
        ],
        "description": "Employee Communication Display - IT office",
        "type": [
            "PI",
            "Video Updates"
        ]
    },
    {
        "appName": "AQ Screen - NAM-CNL-U20CWH",
        "department": [
            "Production"
        ],
        "appUrl": "https://d1t78nn709oakl.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-CNL-U20CWH",
        "orgCode": [
            "CNL"
        ],
        "description": "Availability & Quality Screen for Unit 20",
        "type": [
            "PI",
            "AQ Screen"
        ]
    },
    {
        "appName": "EDI Van Manager",
        "orgCode": [
            "CNL"
        ],
        "department": [
            "Admin"
        ],
        "description": "Van Manager",
        "appUrl": "https://d1r5mvkpor330v.cloudfront.net/"
    },
    {
        "appName": "GWH - Pass Thru Repack (CUU)",
        "department": [
            "Engineering",
            "Logistics"
        ],
        "appUrl": "http://10.130.2.212:8080/admin",
        "orgCode": [
            "CUU"
        ],
        "description": "LMPR link",
        "type": [
            "Application",
            "Data Tracking"
        ]
    },
    {
        "appName": "Generic Black Screen - NAM-CNL-U20CWH-FLOOR",
        "department": [
            "Production"
        ],
        "appUrl": "https://d20y46xrkjaxww.cloudfront.net/?apiKey=ZSMWFFGLa17Tp9AkO00OB3FAPDKIGlYG0koGOI80&locators=NAM-CNL-U20CWH&typeFilters=DOWN,NO_JOB,JOB_STATUS_ERROR_ALARM&showMachineTotals=true&title=U20%20Floor",
        "orgCode": [
            "CNL",
            "CWH"
        ],
        "description": "FLOOR black screen for Unit 20",
        "type": [
            "PI",
            "Black Screen"
        ]
    },
    {
        "appName": "Generic Black Screen - NAM-SLB-ENG",
        "department": [
            "Engineering"
        ],
        "appUrl": "https://d20y46xrkjaxww.cloudfront.net/?apiKey=ZSMWFFGLa17Tp9AkO00OB3FAPDKIGlYG0koGOI80&locators=NAM-SLB-U40-P01,NAM-SLB-U40-P02,NAM-SLB-U40-P03&typeFilters=DOWN,MATERIAL_DRYING_ALARM,CAVITY_MISMATCH_ALARM,MACHINE_MONITORS_ALARM,LSL_MODE_ERROR,LSL_MISSED_LABEL_ALARM,NO_JOB,MSV_MISSING_SETUP_ALARM,NO_CONCENTRATE_ALARM,MIN_CUSHION_ALARM,NO_WATER_FLOW_ALARM,MASTER_SETUP_ALARM,PARAMETER_MODE_ALARM,DIVERTER_CHUTE_ALARM,HOTBOX_ERROR_ALARM,NO_CLEAN_POINT_ALARM,ROBOT_ERROR_ALARM&showMachineTotals=true&title=SLB%20Eng",
        "orgCode": [
            "SLB"
        ],
        "description": "ENGINEERING black screen for SLB",
        "type": [
            "PI",
            "Black Screen"
        ]
    },
    {
        "appName": "Mold Change Screen - U1",
        "department": [
            "Production",
            "Quality",
            "Tooling",
            "Planning"
        ],
        "appUrl": "https://d3oqqcu9cgrwny.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-CNL-U1",
        "orgCode": [
            "CNL"
        ],
        "description": "MATERIAL CHANGE SCREEN - U1",
        "type": [
            "PI",
            "Material Change Screen"
        ]
    },
    {
        "appName": "Generic Black Screen - NAM-CNL-U18-FLOOR*",
        "department": [
            "Production"
        ],
        "appUrl": "https://d20y46xrkjaxww.cloudfront.net/?apiKey=ZSMWFFGLa17Tp9AkO00OB3FAPDKIGlYG0koGOI80&locators=NAM-CNL-U18&typeFilters=DOWN,PRINTER_HALTED_ALARM,JOB_STATUS_ERROR_ALARM,MATERIAL_DRYING_ALARM,MACHINE_MONITORS_ALARM,LSL_MODE_ERROR,LSL_MISSED_LABEL_ALARM,NO_JOB,NO_CONCENTRATE_ALARM,MIN_CUSHION_ALARM,NO_WATER_FLOW_ALARM&showMachineTotals=true&title=U18%20Floor",
        "orgCode": [
            "CNL"
        ],
        "description": "FLOOR black screen for Unit 18 Molding",
        "type": [
            "PI",
            "Black Screen"
        ]
    },
    {
        "appName": "Generic Black Screen - NAM-CNL-U1-MATERIAL",
        "department": [
            "Production"
        ],
        "appUrl": "https://d20y46xrkjaxww.cloudfront.net/?apiKey=ZSMWFFGLa17Tp9AkO00OB3FAPDKIGlYG0koGOI80&locators=NAM-CNL-U1&typeFilters=DOWN,JOB_STATUS_ERROR_ALARM,DOWN_PLANNED,MATERIAL_REQUEST&downTypeFilters=WAITING_ON_MATERIAL_-_NEW_JOB,WAITING_ON_MATERIAL_-_RUNNING_JOB,MATERIAL_DRY_TIME,OUT_OF_MATERIAL,WAITING_ON_COLOR_CHANGE,MATERIAL_IN_TRANSIT,COLOR_CHANGE,WAITING_FOR_COMPONENTS&showMachineTotals=true&title=Material",
        "orgCode": [
            "CNL"
        ],
        "description": "Material black screen for Unit 1",
        "type": [
            "PI",
            "Black Screen"
        ]
    },
    {
        "appName": "AQ Screen - NAM-LVG-U05",
        "department": [
            "Production"
        ],
        "appUrl": "https://d1t78nn709oakl.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-LVG-U05",
        "orgCode": [
            "LVG"
        ],
        "description": "Availability & Quality screen for Unit 5 Molding",
        "type": [
            "PI",
            "AQ Screen"
        ]
    },
    {
        "appName": "Generic Black Screen - NAM-SLB-U40-P01-FLOOR",
        "department": [
            "Production"
        ],
        "appUrl": "https://d20y46xrkjaxww.cloudfront.net/?apiKey=ZSMWFFGLa17Tp9AkO00OB3FAPDKIGlYG0koGOI80&locators=NAM-SLB-U40-P01&typeFilters=DOWN,MATERIAL_DRYING_ALARM,MACHINE_MONITORS_ALARM,JOB_STATUS_ERROR_ALARM,LSL_MODE_ERROR,LSL_MISSED_LABEL_ALARM,NO_CONCENTRATE_ALARM,MIN_CUSHION_ALARM,NO_WATER_FLOW_ALARM&showMachineTotals=true&title=U40%20P01%20Floor",
        "orgCode": [
            "SLB"
        ],
        "description": "FLOOR black screen for SLB Plant 1",
        "type": [
            "PI",
            "Black Screen"
        ]
    },
    {
        "appName": "Mold Change Screen - NAM-SLB-U40-P01",
        "department": [
            "Planning",
            "Production"
        ],
        "appUrl": "https://d3oqqcu9cgrwny.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-SLB-U40-P01",
        "orgCode": [
            "SLB"
        ],
        "description": "Mold Change List for SLB Plant 1",
        "type": [
            "PI",
            "Mold Change"
        ]
    },
    {
        "appName": "Generic Black Screen - NAM-SLB-U40-P01-FLOOR*",
        "department": [
            "Production"
        ],
        "appUrl": "https://d20y46xrkjaxww.cloudfront.net/?apiKey=ZSMWFFGLa17Tp9AkO00OB3FAPDKIGlYG0koGOI80&locators=NAM-SLB-U40-P01&typeFilters=DOWN,MATERIAL_DRYING_ALARM,MACHINE_MONITORS_ALARM,JOB_STATUS_ERROR_ALARM,LSL_MODE_ERROR,LSL_MISSED_LABEL_ALARM,NO_CONCENTRATE_ALARM,MIN_CUSHION_ALARM,NO_WATER_FLOW_ALARM,DIVERTER_CHUTE_ALARM,HOTBOX_ERROR_ALARM,NO_CLEAN_POINT_ALARM,ROBOT_ERROR_ALARM&showMachineTotals=true&title=U40%20P01%20Floor",
        "orgCode": [
            "SLB"
        ],
        "description": "FLOOR black screen for SLB Plant 1",
        "type": [
            "PI",
            "Black Screen"
        ]
    },
    {
        "appName": "Mold Change Screen - All Unit 40",
        "department": [
            "Production"
        ],
        "appUrl": "https://d3oqqcu9cgrwny.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-SLB-U40-P01&NAM-SLB-U40-P02&NAM-SLB-U40-P03",
        "orgCode": [
            "SLB"
        ],
        "description": "Mold Change List - All SLB",
        "type": [
            "PI",
            "Mold Change"
        ]
    },
    {
        "appName": "CNL - Unit 01 – Assemblies(R)",
        "department": [
            "Engineering",
            "Production"
        ],
        "appUrl": "http://10.106.205.84/client/login/",
        "orgCode": [
            "CNL"
        ],
        "description": "LMPR link",
        "type": [
            "Application",
            "Data Tracking"
        ]
    },
    {
        "appName": "Generic Black Screen - NAM-MEX-U21-FLOOR",
        "department": [
            "Production"
        ],
        "appUrl": "https://d20y46xrkjaxww.cloudfront.net/?apiKey=ZSMWFFGLa17Tp9AkO00OB3FAPDKIGlYG0koGOI80&locators=NAM-MEX-U21&typeFilters=DOWN,MATERIAL_DRYING_ALARM,MACHINE_MONITORS_ALARM,MSV_MISSING_SETUP_ALARM,CAVITY_MISMATCH_ALARM,JOB_STATUS_ERROR_ALARM,LSL_MODE_ERROR,LSL_MISSED_LABEL_ALARM,NO_CONCENTRATE_ALARM,MIN_CUSHION_ALARM,NO_WATER_FLOW_ALARM,MASTER_SETUP_ALARM,DIVERTER_CHUTE_ALARM,HOTBOX_ERROR_ALARM,NO_CLEAN_POINT_ALARM,ROBOT_ERROR_ALARM&showMachineTotals=true&title=MEX%20Floor",
        "orgCode": [
            "CUU"
        ],
        "description": "FLOOR black screen - Unit 21",
        "type": [
            "PI",
            "Black Screen"
        ]
    },
    {
        "appName": "MATERIAL CHANGE SCREEN - NAM-MEX-U21",
        "department": [
            "Engineering",
            "Production",
            "Planning",
            "Quality",
            "Tooling"
        ],
        "appUrl": "https://d3oqqcu9cgrwny.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-MEX-U21/MATERIAL",
        "orgCode": [
            "CUU"
        ],
        "description": "Material Change Screen for Unit 21",
        "type": [
            "PI",
            "Material Change Screen"
        ]
    },
    {
        "appName": "CWH Shipping Status",
        "department": [
            "Logistics"
        ],
        "appUrl": "https://cwhshipping.nifconet.com/",
        "orgCode": [
            "CWH"
        ],
        "description": "Shipping Status Screen for CWH",
        "type": [
            "Application",
            "Data Tracking"
        ]
    },
    {
        "appName": "AQ Screen - U40 P01",
        "department": [
            "Production"
        ],
        "appUrl": "https://d1t78nn709oakl.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-SLB-U40-P01",
        "orgCode": [
            "SLB"
        ],
        "description": "Availability & Quality screen for SLB Plant 1",
        "type": [
            "PI",
            "AQ Screen"
        ]
    },
    {
        "appName": "AQ Screen - NAM-MEX-U21",
        "department": [
            "Production"
        ],
        "appUrl": "https://d1t78nn709oakl.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-MEX-U21",
        "orgCode": [
            "CUU"
        ],
        "description": "Availability & Quality screen for Unit 21",
        "type": [
            "PI",
            "AQ Screen"
        ]
    },
    {
        "appName": "Generic Black Screen - NAM-CNL-U18-FLOOR",
        "department": [
            "Production"
        ],
        "appUrl": "https://d20y46xrkjaxww.cloudfront.net/?apiKey=ZSMWFFGLa17Tp9AkO00OB3FAPDKIGlYG0koGOI80&locators=NAM-CNL-U18&typeFilters=DOWN,PRINTER_HALTED_ALARM,CAVITY_MISMATCH_ALARM,JOB_STATUS_ERROR_ALARM,MATERIAL_DRYING_ALARM,MACHINE_MONITORS_ALARM,LSL_MODE_ERROR,LSL_MISSED_LABEL_ALARM,NO_JOB,NO_CONCENTRATE_ALARM,MIN_CUSHION_ALARM,NO_WATER_FLOW_ALARM&showMachineTotals=true&title=U18%20Floor",
        "orgCode": [
            "CNL"
        ],
        "description": "FLOOR black screen for Unit 18 Molding",
        "type": [
            "PI",
            "Black Screen"
        ]
    },
    {
        "appName": "SLB - Packing and Assemblies(R)",
        "department": [
            "Engineering",
            "Production"
        ],
        "appUrl": "http://10.106.205.85/client/login",
        "orgCode": [
            "SLB"
        ],
        "description": "LMPR link",
        "type": [
            "Application",
            "Data Tracking"
        ]
    },
    {
        "appName": "AQ Screen - U40 P03",
        "department": [
            "Production"
        ],
        "appUrl": "https://d1t78nn709oakl.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-SLB-U40-P03",
        "orgCode": [
            "SLB"
        ],
        "description": "Availability & Quality screen for SLB Plant 3",
        "type": [
            "PI",
            "AQ Screen"
        ]
    },
    {
        "appName": "MATERIAL CHANGE SCREEN - NAM-SLB-U40-P03",
        "department": [
            "Engineering",
            "Production",
            "Planning",
            "Quality",
            "Tooling"
        ],
        "appUrl": "https://d3oqqcu9cgrwny.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-SLB-U40-P03/MATERIAL",
        "orgCode": [
            "SLB"
        ],
        "description": "Material Change Screen for Unit 40 Plant 3",
        "type": [
            "PI",
            "Material Change Screen"
        ]
    },
    {
        "appName": "Toyota Release Upload",
        "department": [
            "Logistics"
        ],
        "appUrl": "https://toyotaupload.nifconet.com/",
        "orgCode": [
            "SLB"
        ],
        "description": "Interface for uploading Toyota Order Release Data",
        "type": [
            "Application",
            "Manager Tools"
        ]
    },
    {
        "appName": "MATERIAL CHANGE SCREEN - NAM-SLB-U40-P01",
        "department": [
            "Engineering",
            "Production",
            "Planning",
            "Quality",
            "Tooling"
        ],
        "appUrl": "https://d3oqqcu9cgrwny.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-SLB-U40-P01/MATERIAL",
        "orgCode": [
            "SLB"
        ],
        "description": "Material Change Screen for Unit 40 Plant 1",
        "type": [
            "PI",
            "Material Change Screen"
        ]
    },
    {
        "appName": "MATERIAL CHANGE SCREEN - NAM-CNL-U1",
        "department": [
            "Engineering",
            "Production",
            "Planning",
            "Quality",
            "Tooling"
        ],
        "appUrl": "https://d3oqqcu9cgrwny.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-CNL-U1/MATERIAL",
        "orgCode": [
            "CNL"
        ],
        "description": "Material Change Screen for Unit 1",
        "type": [
            "PI",
            "Material Change Screen"
        ]
    },
    {
        "appName": "Mold Change Screen - NAM-CNL-U1",
        "department": [
            "Planning",
            "Production"
        ],
        "appUrl": "https://d3oqqcu9cgrwny.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-CNL-U1",
        "orgCode": [
            "CNL"
        ],
        "description": "Mold Change List for Unit 1",
        "type": [
            "PI",
            "Mold Change"
        ]
    },
    {
        "appName": "Generic Black Screen - NAM-LVG-U05-FLOOR",
        "department": [
            "Production"
        ],
        "appUrl": "https://d20y46xrkjaxww.cloudfront.net/?apiKey=ZSMWFFGLa17Tp9AkO00OB3FAPDKIGlYG0koGOI80&locators=NAM-LVG-U05&typeFilters=DOWN,MATERIAL_DRYING_ALARM,CAVITY_MISMATCH_ALARM,MACHINE_MONITORS_ALARM,LSL_MODE_ERROR,LSL_MISSED_LABEL_ALARM,NO_JOB,NO_CONCENTRATE_ALARM,MIN_CUSHION_ALARM,NO_WATER_FLOW_ALARM,DIVERTER_CHUTE_ALARM,HOTBOX_ERROR_ALARM,NO_CLEAN_POINT_ALARM,ROBOT_ERROR_ALARM&showMachineTotals=true&title=U05%20Floor",
        "orgCode": [
            "LVG"
        ],
        "description": "FLOOR black screen for Unit 5 Molding",
        "type": [
            "PI",
            "Black Screen"
        ]
    },
    {
        "appName": "Video Updates - CNL-Main-Breakroom",
        "department": [
            "Sales",
            "Design",
            "Planning",
            "Production",
            "Engineering",
            "Quality",
            "Tooling",
            "Logistics"
        ],
        "appUrl": "https://d3vblchdgxvk5.cloudfront.net/CNL-Main-Breakroom",
        "orgCode": [
            "CNL"
        ],
        "description": "Employee Communication Display - CNL",
        "type": [
            "PI",
            "Video Updates"
        ]
    },
    {
        "appName": "Shipping Missing Kanban Screen - SLB",
        "department": [
            "Logistics"
        ],
        "appUrl": "https://d31g888iqwwaq8.cloudfront.net/da2-lqo3vmv5cjhenbcoun2nqavanm/30030&7351A",
        "orgCode": [
            "SLB"
        ],
        "description": "Toyota Skid Build Order Progress & Missed Kanbans",
        "type": [
            "PI",
            "Status"
        ]
    },
    {
        "appName": "Outsource Locations(R) - U07",
        "department": [
            "Engineering",
            "Production"
        ],
        "appUrl": "http://10.106.205.89/client/login/",
        "orgCode": [
            "CNL",
            "CWH",
            "SLB",
            "LVG",
            "CUU",
            "NCM",
            "KWA"
        ],
        "description": "LMPR Link",
        "type": [
            "Application",
            "Data Tracking"
        ]
    },
    {
        "appName": "Mold Change Screen - NAM-SLB-U40-P03",
        "department": [
            "Production",
            "Planning"
        ],
        "appUrl": "https://d3oqqcu9cgrwny.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-SLB-U40-P03",
        "orgCode": [
            "SLB"
        ],
        "description": "Mold Change List for SLB Plant 3",
        "type": [
            "PI",
            "Mold Change"
        ]
    },
    {
        "appName": "Mold Change Screen - Chihuahua U21",
        "department": [
            "Planning",
            "Production"
        ],
        "appUrl": "https://d3oqqcu9cgrwny.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-MEX-U21",
        "orgCode": [
            "CUU"
        ],
        "description": "Mold Change List for Unit 21",
        "type": [
            "PI",
            "Mold Change"
        ]
    },
    {
        "appName": "LVG - Unit 05 - Assemblies",
        "department": [
            "Engineering",
            "Production"
        ],
        "appUrl": "http://10.106.205.74/client/login/",
        "orgCode": [
            "LVG"
        ],
        "description": "LMPR Link",
        "type": [
            "Application",
            "Data Tracking"
        ]
    },
    {
        "appName": "Mold Change Screen - NAM-CNL-U18",
        "department": [
            "Production",
            "Planning"
        ],
        "appUrl": "https://d3oqqcu9cgrwny.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-CNL-U18",
        "orgCode": [
            "CNL"
        ],
        "description": "Mold Change List for Unit 18",
        "type": [
            "PI",
            "Mold Change"
        ]
    },
    {
        "appName": "SLB Shipping Status",
        "department": [
            "Logistics"
        ],
        "appUrl": "https://slbshipping.nifconet.com/",
        "orgCode": [
            "SLB"
        ],
        "description": "Shipping Status Screen for SLB",
        "type": [
            "Application",
            "Data Tracking"
        ]
    },
    {
        "appName": "AQ Screen - U40 P02",
        "department": [
            "Production"
        ],
        "appUrl": "https://d1t78nn709oakl.cloudfront.net/da2-rpnvdkwrjvbyro7rry3d2lqlc4/NAM-SLB-U40-P02",
        "orgCode": [
            "SLB"
        ],
        "description": "Availability & Quality screen for SLB Plant 2",
        "type": [
            "PI",
            "AQ Screen"
        ]
    },
    {
        "appName": "Chihuahua – Packing and Assemblies(R)",
        "department": [
            "Engineering",
            "Planning",
            "Production"
        ],
        "appUrl": "http://10.106.205.82/client/login",
        "orgCode": [
            "CUU"
        ],
        "description": "LMPR link",
        "type": [
            "Application",
            "Data Tracking"
        ]
    }
]