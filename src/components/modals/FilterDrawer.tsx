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
import {filterDrawerOpen, snackBarOpen, snackBarSeverity, snackBarText} from '../global/recoilMain'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import TuneIcon from '@mui/icons-material/Tune';
import DeleteIcon from '@mui/icons-material/Delete';
import {catalogListAtom, filteredCatalog} from '../global/recoilTyped'
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function FilterDrawer() {
    const [openDrawer, setOpenDrawer] = useRecoilState(filterDrawerOpen)
    const [org, setOrg] = React.useState('')
    const [dept, setDept] = React.useState('')
    const [status, setStatus] = React.useState('')
    const [types, setTypes] = React.useState<string[]>([])
    const [units, setUnits] = React.useState<string[]>([])
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const catalogList = useRecoilValue(catalogListAtom)
    const setFiltered = useSetRecoilState(filteredCatalog)
    const handleDeptChange = (event: SelectChangeEvent) => {
        setDept(event.target.value as string);
    }
    const handleOrgChange = (event: SelectChangeEvent) => {
        setOrg(event.target.value as string);
    }
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
        if(org !== '') {
            filteredList = filteredList.filter(x => x.org === org)
        }
        if(units.length !== 0) {
            for (let i = 0; i < units.length; i++) {
                filteredList = filteredList.filter(x => {
                    return (x.unitAdoption.map(y => units[i] === y)).includes(true)
                })
            }
        }
        if(dept !== '') {
            filteredList = filteredList.filter(x => x.department === dept)
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
        setOrg('')
        setUnits([])
        setDept('')
        setFiltered(catalogList)

        setSnackSev('info')
        setSnackText('Filter cleared')
        setSnackOpen(true)
        setOpenDrawer(false)
    }
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
                            <FormControl fullWidth>
                                <InputLabel>Org</InputLabel>
                                <Select
                                    value={org}
                                    label="Org"
                                    onChange={handleOrgChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {orgOptions.map((x) => (
                                        <MenuItem value={x} key={x}>{x}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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
                            <FormControl fullWidth>
                                <InputLabel>Dept</InputLabel>
                                <Select
                                    value={dept}
                                    label="Dept"
                                    onChange={handleDeptChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {departmentOptions.map((x) => (
                                        <MenuItem value={x} key={x}>{x}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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