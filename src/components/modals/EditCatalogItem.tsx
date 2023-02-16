// noinspection SpellCheckingInspection

import React from 'react'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
    editCategoryOpen,
    snackBarOpen,
    snackBarSeverity,
    snackBarText,
    categoryItem,
    accessTokenAtom, loadingTitle, loadingOpen, userRole
} from '../global/recoilMain'
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {departmentOptions, orgOptions, statusOptions, typeOptions, unitOptions} from "../global/DropDowns";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import {catalogListAtom, filteredCatalog, imgData, imgItem} from "../global/recoilTyped";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';
import dayjs, {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {itemType} from "../global/recoilTyped";
import {createTableItem, deletePhoto, getUploadUrl, uploadAttachedDocument} from "../helpers/api";
import {readFileData} from "../helpers/misc";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Grow from "@mui/material/Grow";
import PhotoIcon from "@mui/icons-material/Photo";
import DeleteIcon from "@mui/icons-material/Delete";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function EditCatalogItem() {
    const [openModal, setOpenModal] = useRecoilState(editCategoryOpen)
    const currentItem = useRecoilValue(categoryItem)
    const [catalogList, setCatalogList] = useRecoilState(catalogListAtom)
    let currentItemDetails: itemType | undefined = catalogList.find(x => x.recordId === currentItem)
    const [title, setTitle] = React.useState('')
    const [status, setStatus] = React.useState<string | null>(null);
    const [image, setImage] = React.useState('')
    const [webLink, setWebLink] = React.useState<string | null>('')
    const [displayLink, setDisplayLink] = React.useState<string | null>('')
    const [reportLink, setReportLink] = React.useState<string | null>('')
    const [description, setDescription] = React.useState('')
    const [details, setDetails] = React.useState('')
    const [units, setUnits] = React.useState<string[]>([])
    const [org, setOrg] = React.useState<string | null>(null);
    const [type, setType] = React.useState<string[]>([])
    const [releaseDate, setReleaseDate] = React.useState<Dayjs | null>(null)
    const [dept, setDept] = React.useState<string | null>(null);
    const [errorText, setErrorText] = React.useState('')
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const setFiltered = useSetRecoilState(filteredCatalog)
    const accessToken = useRecoilValue(accessTokenAtom)
    const setLoadingTitle = useSetRecoilState(loadingTitle);
    const setOpenLoad = useSetRecoilState(loadingOpen);
    const userRoleName = useRecoilValue(userRole)
    const [imageData, setImageData] = useRecoilState(imgData);
    let Buffer = require('buffer/').Buffer
    const [imageCust, setImageCust] = React.useState<any>(null)

    const verifyInputs = () => {
        if(userRoleName !== 'admin') {
            setErrorText('Must be admin to do this')
            return false
        }
        if (title === '' || title === null) {
            setErrorText('Please enter a Long Title')
            return false
        }
        if (status === '' || status === null) {
            setErrorText('Please enter a Status')
            return false
        }
        if (type === null || type?.length === 0) {
            setErrorText('Please enter a Type')
            return false
        }
        if (description === '' || description === null) {
            setErrorText('Please enter a Description')
            return false
        }
        if (details === '' || details === null) {
            setErrorText('Please enter Details')
            return false
        }
        return true
    }

    async function handleUploadPhoto(id: string) {
        let imageURL = await getUploadUrl(accessToken, id, 'image/jpeg','PUT')
        let fileDatainit = await readFileData(imageCust)

        let fileData = fileDatainit.replace('data:image/jpeg;base64,', '')
        await uploadAttachedDocument(imageURL,Buffer(fileData, 'base64'),'image/jpeg').then(() => {

            let newArray: imgItem[]
            if (imageData.length === 0) { //if array is empty
                newArray = [{id: id, img: fileDatainit}]
                setImageData(newArray)
            } else if(imageData.find(x => x.id === id)){ //if item is already in array
                newArray = imageData.map(obj => {
                    if (obj.id === id) {
                        return {...obj,
                            img: fileDatainit
                        }
                    }
                    return obj;
                })
                setImageData(newArray)
            } else { //if item is not in array
                setImageData((prevState: any) => [...prevState, {id: id, img: fileDatainit}])
            }

            setOpenModal(false)
            setErrorText('')
            setSnackSev('success')
            setSnackText('Item Added!')
            setSnackOpen(true)
            setOpenLoad(false)
        }).catch((reason) => {
            setErrorText(reason.name)
            setSnackSev('error')
            setSnackText(reason.name)
            setSnackOpen(true)
        })
    }

    async function handleSubmit(event: any) {
        event.preventDefault()
        setErrorText('')
        setLoadingTitle('Updating item')
        setOpenLoad(true)
        if(verifyInputs()) {
            let newArr: itemType[] = catalogList.map(obj => {
                if (obj.recordId === currentItem) {
                    return {...obj,
                        title: title,
                        status: status === null ? '' : status,
                        imgURL: imageCust === null ? '' : 'exists',
                        webLink: webLink,
                        displayLink: displayLink,
                        reportLink: reportLink,
                        description: description,
                        details: details,
                        unitAdoption: units,
                        department: dept,
                        org: org,
                        typeAvailable: type,
                        releasedDate: dayjs(releaseDate).valueOf(),
                    }
                }
                return obj;
            })

            let updatedItem: itemType = {
                recordId: currentItem,
                title: title,
                status: status === null ? '' : status,
                imgURL: imageCust === null ? '' : 'exists',
                webLink: webLink,
                displayLink: displayLink,
                reportLink: reportLink,
                description: description,
                details: details,
                unitAdoption: units,
                department: dept,
                org: org,
                typeAvailable: type,
                createdDate: currentItemDetails?.createdDate === undefined ? dayjs().valueOf() : currentItemDetails?.createdDate,
                releasedDate: dayjs(releaseDate).valueOf(),
            }

            await createTableItem(accessToken, currentItem, updatedItem ).then(() => {
                if(imageCust !== null && imageCust !== 'exists') {
                    handleUploadPhoto(currentItem)
                }
                setCatalogList(newArr)
                setFiltered(catalogList)
                setOpenModal(false)
                setErrorText('')
                setSnackSev('success')
                setSnackText('Item updated!')
                setSnackOpen(true)
                setOpenLoad(false)
            })
        }
    }
    function handleImagePick(event: any) {
        setImageCust(event.target.files[0])
    }

    async function openImage() {
        let imgURLa
        if (currentItemDetails?.imgURL !== '') {
            imgURLa = await getUploadUrl(accessToken, currentItem, 'image/jpg','GET')
        } else {
            imgURLa = URL.createObjectURL(imageCust)
        }
        console.log(imgURLa)
        window.open(imgURLa, '_blank');
    }
    async function removeImage() {
        if (currentItemDetails?.imgURL !== '') {
            await deletePhoto(accessToken, currentItem)
        }
        setImage('')
        setImageCust(null)
    }

    React.useEffect(() => {
        if (!openModal) return;
        if (currentItemDetails !== undefined) {
            setTitle(currentItemDetails.title)
            setStatus(currentItemDetails.status)
            setImage('')
            setImageCust(currentItemDetails.imgURL !== '' ? 'exists' : null)
            setWebLink(currentItemDetails.webLink)
            setDisplayLink(currentItemDetails.displayLink === undefined ? '' : currentItemDetails.displayLink)
            setReportLink(currentItemDetails.reportLink)
            setDescription(currentItemDetails.description)
            setDetails(currentItemDetails.details)
            setUnits(currentItemDetails.unitAdoption)
            setDept(currentItemDetails.department === undefined ? null : currentItemDetails.department)
            setOrg(currentItemDetails.org === undefined ? null : currentItemDetails.org)
            setType(currentItemDetails.typeAvailable)
            setReleaseDate(currentItemDetails.releasedDate === null ? null : dayjs(currentItemDetails.releasedDate))
        }
        setErrorText('')
    }, [openModal])
    return(
        <>
            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <DialogTitle sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    Edit Catalog Item
                    <IconButton color="secondary" onClick={() => setOpenModal(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Box component='form'
                     onSubmit={handleSubmit}>
                    <DialogContent sx={{px:3,py:1}}>
                        <Grid container spacing={2}>
                            <Grid xs={12}>
                                <TextField
                                    required
                                    value={title}
                                    onChange={(event: any) => setTitle(event.target.value)}
                                    label='Long Title'
                                    fullWidth
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    required
                                    value={description}
                                    onChange={(event: any) => setDescription(event.target.value)}
                                    label='Short Description'
                                    fullWidth
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    required
                                    value={details}
                                    onChange={(event: any) => setDetails(event.target.value)}
                                    label='More Details'
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                            <Grid xs={12} sm={7}>
                                <Autocomplete
                                    multiple
                                    value={type}
                                    onChange={(event, newValue) => {
                                        setType([
                                            ...newValue,
                                        ]);
                                    }}
                                    id="checkboxes-tags-demo"
                                    options={typeOptions}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {option}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Types Available *" placeholder="Available" />
                                    )}
                                />
                            </Grid>
                            <Grid xs={12} sm={5}>
                                <Autocomplete
                                    value={status}
                                    onChange={(event: any, newValue: string | null) => {
                                        setStatus(newValue);
                                    }}
                                    options={statusOptions}
                                    renderInput={(params) => <TextField {...params} label="Status" required />}
                                    fullWidth
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    value={webLink}
                                    onChange={(event: any) => setWebLink(event.target.value)}
                                    label='Web Link'
                                    fullWidth
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    value={displayLink}
                                    onChange={(event: any) => setDisplayLink(event.target.value)}
                                    label='Display Link'
                                    fullWidth
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    value={reportLink}
                                    onChange={(event: any) => setReportLink(event.target.value)}
                                    label='Report Link'
                                    fullWidth
                                />
                            </Grid>
                            <Grid xs={12} sm={5}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        closeOnSelect
                                        label="Release Date"
                                        value={releaseDate}
                                        onChange={(newValue) => {
                                            setReleaseDate(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} fullWidth/>}
                                        componentsProps={{
                                            actionBar: {
                                                actions: ['today'],
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid xs={8} sm={5} display='flex'>
                                <Tooltip title='JPG files only' arrow>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        fullWidth
                                        color='secondary'
                                        disableElevation
                                        startIcon={<AddPhotoAlternateIcon/>}
                                    >
                                        Upload Image (jpg)
                                        <input
                                            value={image}
                                            onChange={handleImagePick}
                                            hidden
                                            accept="image/jpeg"
                                            type="file"
                                        />
                                    </Button>
                                </Tooltip>
                            </Grid>
                            <Grid xs={2} sm={1} alignSelf='center'>
                                <Grow in={true} timeout={300}>
                                    <Tooltip title='View Image' arrow>
                                        <span>
                                            <IconButton onClick={openImage} size='small' disabled={!imageCust}>
                                                <PhotoIcon/>
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Grow>
                            </Grid>
                            <Grid xs={2} sm={1} alignSelf='center'>
                                <Grow in={true} timeout={500}>
                                    <Tooltip title='Remove Image' arrow>
                                        <span>
                                            <IconButton onClick={removeImage} size='small' disabled={!imageCust}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Grow>
                            </Grid>
                            <Grid xs={12} sm={3}>
                                <Autocomplete
                                    value={org}
                                    onChange={(event: any, newValue: string | null) => {
                                        setOrg(newValue);
                                    }}
                                    options={orgOptions}
                                    renderInput={(params) => <TextField {...params} label="Org" />}
                                    fullWidth
                                />
                            </Grid>
                            <Grid xs={12} sm={5}>
                                <Autocomplete
                                    multiple
                                    value={units}
                                    onChange={(event, newValue) => {
                                        setUnits([
                                            ...newValue,
                                        ]);
                                    }}
                                    id="checkboxes-tags-demo"
                                    options={unitOptions}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {option}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Unit Adoption" placeholder="Units" />
                                    )}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <Autocomplete
                                    value={dept}
                                    onChange={(event: any, newValue: string | null) => {
                                        setDept(newValue);
                                    }}
                                    options={departmentOptions}
                                    renderInput={(params) => <TextField {...params} label="Department" />}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Box sx={{mx:1, mt:0.5}}><Typography color='error'>{errorText}</Typography></Box>
                    <DialogActions>
                        <Button fullWidth variant='contained' type='submit' startIcon={<SaveIcon />} sx={{color: "#FFFFFF"}}>
                            Save Changes
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}