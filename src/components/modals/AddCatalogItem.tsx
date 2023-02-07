import React from 'react'
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {useSetRecoilState, useRecoilState} from "recoil";
import {addCategoryOpen} from "../global/recoilMain";
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import {catalogListAtom, filteredCatalog} from '../global/CatalogList'
import {v4 as uuidv4} from "uuid";
import DialogActions from '@mui/material/DialogActions';
import Typography from "@mui/material/Typography";
import {snackBarSeverity, snackBarText, snackBarOpen} from "../global/recoilMain";
import {unitOptions, statusOptions, orgOptions, departmentOptions} from "../global/DropDowns";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function AddCatalogItem() {
    const [openModal, setOpenModal] = useRecoilState(addCategoryOpen)
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
    const [catalogList, setCatalogList] = useRecoilState(catalogListAtom)
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
            let newItem = {
                longTitle: longTitle,
                shortTitle: shortTitle,
                status: status,
                imgURL: image,
                link: webLink,
                description: description,
                details: details,
                unitAdoption: units,
                org: org,
                department: dept,
                key: uuidv4()
            }
            setCatalogList((prevState: any) => [...prevState, newItem]);
            setFiltered(catalogList)
            setOpenModal(false)
            setErrorText('')
            setSnackSev('success')
            setSnackText('Item Added!')
            setSnackOpen(true)
        }
    }

    React.useEffect(() => {
        if (openModal) return;
        setLongTitle('')
        setShortTitle('')
        setStatus(statusOptions[0])
        setImage('')
        setWebLink('')
        setDescription('')
        setDetails('')
        setUnits([unitOptions[0]])
        setOrg(orgOptions[0])
        setDept(departmentOptions[0])
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
                                <Button variant="contained" component="label" fullWidth color='secondary' disableElevation>
                                    Upload Image
                                    <input
                                        value={image}
                                        onChange={(event: any) => setImage(event.target.value)}
                                        hidden
                                        accept="image/*"
                                        type="file"
                                    />
                                </Button>
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
                    <Button fullWidth variant='outlined' type='submit' startIcon={<AddIcon />}>
                        Add Item
                    </Button>
                </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}