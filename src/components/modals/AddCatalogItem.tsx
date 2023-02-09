import React from 'react'
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {useSetRecoilState, useRecoilState, useRecoilValue} from "recoil";
import {accessTokenAtom, addCategoryOpen, loadingOpen, loadingTitle} from "../global/recoilMain";
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import {catalogListAtom, filteredCatalog} from '../global/recoilTyped'
import {v4 as uuidv4} from "uuid";
import DialogActions from '@mui/material/DialogActions';
import Typography from "@mui/material/Typography";
import {snackBarSeverity, snackBarText, snackBarOpen} from "../global/recoilMain";
import {unitOptions, statusOptions, orgOptions, departmentOptions, typeOptions} from "../global/DropDowns";
import Tooltip from '@mui/material/Tooltip';
import {itemType} from '../global/recoilTyped'
import dayjs, {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {createTableItem} from "../helpers/api";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function AddCatalogItem() {
    const [openModal, setOpenModal] = useRecoilState(addCategoryOpen)
    const accessToken = useRecoilValue(accessTokenAtom)
    const [title, setTitle] = React.useState('')
    const [status, setStatus] = React.useState<string | null>(null);
    const [image, setImage] = React.useState('')
    const [webLink, setWebLink] = React.useState('')
    const [reportLink, setReportLink] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [details, setDetails] = React.useState('')
    const [units, setUnits] = React.useState<string[]>([])
    const [org, setOrg] = React.useState<string | null>(null);
    const [type, setType] = React.useState<string[]>([])
    const [dept, setDept] = React.useState<string | null>(null);
    const [releaseDate, setReleaseDate] = React.useState<Dayjs | null>(dayjs())
    const [errorText, setErrorText] = React.useState('')
    const setLoadingTitle = useSetRecoilState(loadingTitle);
    const setOpenLoad = useSetRecoilState(loadingOpen);
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const [catalogList, setCatalogList] = useRecoilState(catalogListAtom)
    const setFiltered = useSetRecoilState(filteredCatalog)

    const verifyInputs = () => {
        if (title === '' || title === null) {
            setErrorText('Please enter a Long Title')
            return false
        }
        if (status === '' || status === null) {
            setErrorText('Please enter a Status')
            return false
        }
        if (type.length === 0) {
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

    async function handleSubmit(event: any) {
        event.preventDefault()
        setErrorText('')
        setLoadingTitle('Creating Catalog Item')
        setOpenLoad(true)
        if(verifyInputs()) {
            let newItem: itemType = {
                title: title,
                status: status === null ? '' : status,
                imgURL: image,
                webLink: webLink,
                reportLink: reportLink,
                description: description,
                details: details,
                unitAdoption: units,
                org: org,
                typeAvailable: type,
                department: dept,
                recordId: uuidv4(),
                createdDate: dayjs().valueOf(),
                releasedDate: releaseDate === null ? null : dayjs(releaseDate).valueOf(),
            }

            createTableItem(accessToken, newItem.recordId, newItem).then(() => {

                //PUT IMAGE IN S3 BUCKET

                if(catalogList.length === 0) {
                    setCatalogList([newItem])
                } else {
                    setCatalogList((prevState: any) => [...prevState, newItem]);
                }
                setOpenModal(false)
                setErrorText('')
                setSnackSev('success')
                setSnackText('Item Added!')
                setSnackOpen(true)
                setOpenLoad(false)
            })
        }
    }

    React.useEffect(() => {
        setFiltered(catalogList)
    }, [catalogList])

    React.useEffect(() => {
        if (openModal) return;
        setTitle('')
        setStatus(null)
        setImage('')
        setWebLink('')
        setReportLink('')
        setDescription('')
        setDetails('')
        setUnits([])
        setOrg(null)
        setType([])
        setDept(null)
        setReleaseDate(null)
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
                                    autoFocus
                                    value={title}
                                    onChange={(event: any) => setTitle(event.target.value)}
                                    label='Long Title'
                                    fullWidth
                                />
                            </Grid>
                            <Grid xs={12} sm={6}>
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
                                        Upload Image (jpg)
                                        <input
                                            value={image}
                                            onChange={(event: any) => setImage(event.target.value)}
                                            hidden
                                            accept="image/jpg"
                                            type="file"
                                        />
                                    </Button>
                                </Tooltip>
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    value={webLink}
                                    onChange={(event: any) => setWebLink(event.target.value)}
                                    label='Web Link'
                                    fullWidth
                                />
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    value={reportLink}
                                    onChange={(event: any) => setReportLink(event.target.value)}
                                    label='Report Link'
                                    fullWidth
                                />
                            </Grid>
                            <Grid xs={12}>
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
                            <Grid xs={12} sm={6}>
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
                    <Button fullWidth variant='contained' type='submit' startIcon={<AddIcon />} sx={{color: "#FFFFFF"}}>
                        Add Item
                    </Button>
                </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}