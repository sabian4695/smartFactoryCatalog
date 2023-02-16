import React from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {departmentOptions, orgOptions, statusOptions, typeOptions, unitOptions} from "../global/DropDowns";
import FormControl from "@mui/material/FormControl";
import {
    accessTokenAtom,
    filterDrawerOpen,
    snackBarOpen,
    snackBarSeverity,
    snackBarText,
    userRole
} from '../global/recoilMain'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import TuneIcon from '@mui/icons-material/Tune';
import DeleteIcon from '@mui/icons-material/Delete';
import {catalogListAtom, filteredCatalog, itemType} from '../global/recoilTyped'
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {createTableItem} from "../helpers/api";
import dayjs from "dayjs";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function FilterDrawer() {
    const [openDrawer, setOpenDrawer] = useRecoilState(filterDrawerOpen)
    const accessToken = useRecoilValue(accessTokenAtom)
    const [orgs, setOrgs] = React.useState<string[]>([])
    const [depts, setDepts] = React.useState<string[]>([])
    const [status, setStatus] = React.useState('')
    const [types, setTypes] = React.useState<string[]>([])
    const [units, setUnits] = React.useState<string[]>([])
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const catalogList = useRecoilValue(catalogListAtom)
    const [filtered, setFiltered] = useRecoilState(filteredCatalog)
    const role = useRecoilValue(userRole)

    const handleStatusChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    }

    function setFilter() {
        let filteredList = catalogList
        if(types.length !== 0) {
            for (let i = 0; i < types.length; i++) {
                filteredList = filteredList.filter(x => {
                    return (x.typeAvailable.map(y => types[i] === y)).includes(true)
                })
            }
        }
        if(status !== '') {
            filteredList = filteredList.filter(x => x.status === status)
        }
        if(orgs.length !== 0) {
            for (let i = 0; i < orgs.length; i++) {
                filteredList = filteredList.filter(x => {
                    return (x.org.map(y => orgs[i] === y)).includes(true)
                })
            }
        }
        if(units.length !== 0) {
            for (let i = 0; i < units.length; i++) {
                filteredList = filteredList.filter(x => {
                    return (x.unitAdoption.map(y => units[i] === y)).includes(true)
                })
            }
        }
        if(depts.length !== 0) {
            for (let i = 0; i < depts.length; i++) {
                filteredList = filteredList.filter(x => {
                    return (x.department.map(y => depts[i] === y)).includes(true)
                })
            }
        }
        setSnackSev('success')
        setSnackText('Filter applied')
        setSnackOpen(true)
        setFiltered(filteredList)
        setOpenDrawer(false)
    }
    function clearFilter() {
        setTypes([])
        setStatus('')
        setOrgs([])
        setUnits([])
        setDepts([])
        setFiltered(catalogList)

        setSnackSev('info')
        setSnackText('Filter cleared')
        setSnackOpen(true)
        setOpenDrawer(false)
        //runChangeObjects()
    }

    // async function runChangeObjects() {
    //     catalogList.forEach(x => {
    //
    //         let updatedItem: itemType = {
    //             recordId: x.recordId,
    //             title: x.title,
    //             status: x.status,
    //             imgURL: x.imgURL,
    //             webLink: x.webLink,
    //             displayLink: x.displayLink === undefined ? '' : x.displayLink,
    //             reportLink: x.reportLink,
    //             description: x.description,
    //             details: x.details,
    //             unitAdoption: x.unitAdoption,
    //             //@ts-ignore
    //             department: x.department === undefined ? [] : [x.department],
    //             //@ts-ignore
    //             org: x.org === undefined ? [] : [x.org],
    //             typeAvailable: x.typeAvailable,
    //             createdDate: x.createdDate,
    //             releasedDate: x.releasedDate,
    //         }
    //         createTableItem(accessToken, x.recordId, updatedItem ).then(() => {
    //                 console.log('success')
    //         }).catch((reason) => {
    //                 console.log(x.recordId)
    //                 console.error(reason.name)
    //         })
    //     })
    // }

    React.useEffect(() => {
        if (!openDrawer) {return}
        if (filtered === catalogList) {
            setTypes([])
            setStatus('')
            setOrgs([])
            setUnits([])
            setDepts([])
        }
    }, [openDrawer])
    return(
        <>
            <Drawer
                anchor={'left'}
                open={openDrawer}
                onClose={() => setOpenDrawer( false)}
            >
                <Box sx={{width:300}}>
                    <List>
                        <ListItem>
                            <Autocomplete
                                multiple
                                value={types}
                                fullWidth
                                onChange={(event, newValue) => {
                                    setTypes([
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
                                    <TextField {...params} fullWidth label="Types Available" placeholder="Types" />
                                )}
                            />
                        </ListItem>
                        <ListItem>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={status}
                                    label="Status"
                                    onChange={handleStatusChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {statusOptions.map((x) => (
                                        <MenuItem value={x} key={x}>{x}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </ListItem>
                        <ListItem>
                            <Autocomplete
                                multiple
                                value={orgs}
                                fullWidth
                                onChange={(event, newValue) => {
                                    setOrgs([
                                        ...newValue,
                                    ]);
                                }}
                                id="checkboxes-tags-demo"
                                options={orgOptions}
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
                                    <TextField {...params} fullWidth label="Orgs" placeholder="Orgs" />
                                )}
                            />
                        </ListItem>
                        <ListItem>
                            <Autocomplete
                                multiple
                                fullWidth
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
                        </ListItem>
                        <ListItem>
                            <Autocomplete
                                multiple
                                value={depts}
                                fullWidth
                                onChange={(event, newValue) => {
                                    setDepts([
                                        ...newValue,
                                    ]);
                                }}
                                id="checkboxes-tags-demo"
                                options={departmentOptions}
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
                                    <TextField {...params} fullWidth label="Departments" placeholder="Departments" />
                                )}
                            />
                        </ListItem>
                        <ListItem>
                            <Button
                                variant='contained'
                                fullWidth
                                startIcon={<TuneIcon/>}
                                sx={{color:'#FFFFFF'}}
                                onClick={setFilter}
                            >
                                Apply Filter
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Button
                                variant='outlined'
                                fullWidth
                                color='secondary'
                                startIcon={<DeleteIcon/>}
                                onClick={clearFilter}
                            >
                                Clear Filter
                            </Button>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    )
}