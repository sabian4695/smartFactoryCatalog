import React from 'react'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {editCatagoryOpen, snackBarOpen, snackBarSeverity, snackBarText, categoryItem} from '../global/recoilMain'
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {departmentOptions, orgOptions, statusOptions, unitOptions} from "../global/DropDowns";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import {catalogListAtom, filteredCatalog} from "../global/CatalogList";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function EditCatalogItem() {
    const [openModal, setOpenModal] = useRecoilState(editCatagoryOpen)
    const currentItem = useRecoilValue(categoryItem)
    const [catalogList, setCatalogList] = useRecoilState(catalogListAtom)
    let currentItemDetails = catalogList.find(x => x.recordId === currentItem)
    const [longTitle, setLongTitle] = React.useState('')
    const [shortTitle, setShortTitle] = React.useState('')
    const [status, setStatus] = React.useState<string | null>(statusOptions[0]);
    const [image, setImage] = React.useState('')
    const [webLink, setWebLink] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [details, setDetails] = React.useState('')
    const [units, setUnits] = React.useState([unitOptions[0]])
    const [org, setOrg] = React.useState<string | null>(orgOptions[0]);
    const [dept, setDept] = React.useState<string | null>(departmentOptions[0]);
    const [errorText, setErrorText] = React.useState('')
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const setFiltered = useSetRecoilState(filteredCatalog)

    const verifyInputs = () => {
        if (longTitle === '' || longTitle === null) {
            setErrorText('Please enter a Long Title')
            return false
        }
        if (shortTitle === '' || shortTitle === null) {
            setErrorText('Please enter a Short Title')
            return false
        }
        if (status === '' || status === null) {
            setErrorText('Please enter a Status')
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

    function handleSubmit(event: any) {
        event.preventDefault()
        setErrorText('')
        if(verifyInputs()) {
            let newArr = catalogList.map(obj => {
                if (obj.recordId === currentItem) {
                    return {...obj,
                        longTitle: longTitle,
                        shortTitle: shortTitle,
                        status: status,
                        //imgURL: image, //CURRENTLY CAN'T IMPORT IMAGES VIA RECOIL. NEED TO ADD WITH API
                        link: webLink,
                        description: description,
                        details: details,
                        unitAdoption: units,
                        org: org,
                        department: dept,
                    }
                }
                return obj;
            })
            //@ts-ignore
            setCatalogList(newArr)
            setFiltered(catalogList)
            setOpenModal(false)
            setErrorText('')
            setSnackSev('success')
            setSnackText('Item updated!')
            setSnackOpen(true)
        }
    }
    function changeImage(event: any) {
        const fileExtension = event.target.value.split(".").at(-1);
        const allowedFileTypes = "jpg"
        if (!allowedFileTypes.includes(fileExtension)) {
            setSnackSev('error')
            setSnackText('File must be a jpg')
            setSnackOpen(true)
            setErrorText('File must be a jpg')
            return false;
        }
        setImage(event.target.value)
    }
    React.useEffect(() => {
        if (!openModal) return;
        if (currentItemDetails) {
            setLongTitle(currentItemDetails?.longTitle)
            setShortTitle(currentItemDetails?.shortTitle)
            setStatus(currentItemDetails?.status)
            //setImage(currentItemDetails?.imgURL) //CURRENTLY CAN'T IMPORT IMAGES VIA RECOIL. NEED TO ADD WITH API
            setDescription(currentItemDetails?.description)
            setDetails(currentItemDetails?.details)
            setOrg(currentItemDetails?.org)
            setDept(currentItemDetails?.department)
            if (currentItemDetails?.link !== undefined && currentItemDetails?.link !== null) {
                setWebLink(currentItemDetails.link)
            } else {
                setWebLink('')
            }
            if (currentItemDetails?.unitAdoption !== undefined && currentItemDetails?.unitAdoption !== null) {
                setUnits(currentItemDetails.unitAdoption)
            } else {
                setUnits([''])
            }
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
                    Add New Catalog Item
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
                                    value={longTitle}
                                    onChange={(event: any) => setLongTitle(event.target.value)}
                                    label='Long Title'
                                    fullWidth
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    required
                                    value={shortTitle}
                                    onChange={(event: any) => setShortTitle(event.target.value)}
                                    label='Short Title'
                                    fullWidth
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
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
                            <Grid xs='auto' sx={{display: 'flex', flexGrow: '1'}}>
                                <Tooltip title='JPG files only' arrow>
                                    <Button variant="contained" component="label" fullWidth color='secondary' disableElevation>
                                        Upload Image
                                        <input
                                            value={image}
                                            onChange={changeImage}
                                            hidden
                                            accept="image/*"
                                            type="file"
                                        />
                                    </Button>
                                </Tooltip>
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    value={webLink}
                                    onChange={(event: any) => setWebLink(event.target.value)}
                                    label='Web Link'
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
                            <Grid xs={12}>
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
                            <Grid xs={12} sm={6}>
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
                            <Grid xs={12} sm={6}>
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
                        <Button fullWidth variant='outlined' type='submit' startIcon={<SaveIcon />}>
                            Save Changes
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}