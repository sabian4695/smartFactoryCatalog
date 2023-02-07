import React from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {departmentOptions, orgOptions, statusOptions} from "../global/DropDowns";
import FormControl from "@mui/material/FormControl";
import {filterDrawerOpen, snackBarOpen, snackBarSeverity, snackBarText} from '../global/recoilMain'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import TuneIcon from '@mui/icons-material/Tune';
import DeleteIcon from '@mui/icons-material/Delete';
import {catalogListAtom, filteredCatalog} from '../global/CatalogList'

export default function FilterDrawer() {
    const [openDrawer, setOpenDrawer] = useRecoilState(filterDrawerOpen)
    const [org, setOrg] = React.useState('')
    const [dept, setDept] = React.useState('')
    const [status, setStatus] = React.useState('')
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
        if(org !== '') {
            filteredList = filteredList.filter(x => x.org === org)
        }
        if(dept !== '') {
            filteredList = filteredList.filter(x => x.department === dept)
        }
        if(status !== '') {
            filteredList = filteredList.filter(x => x.status === status)
        }
        setSnackSev('success')
        setSnackText('Filter applied')
        setSnackOpen(true)
        setFiltered(filteredList)
        setOpenDrawer(false)
    }
    function clearFilter() {
        setSnackSev('info')
        setSnackText('Filter cleared')
        setSnackOpen(true)
        setOrg('')
        setDept('')
        setStatus('')
        setFiltered(catalogList)
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