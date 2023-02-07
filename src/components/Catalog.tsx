import React from 'react'
import CatalogItem from './CatalogItem'
import {filteredCatalog} from './global/CatalogList'
import Grid from '@mui/material/Unstable_Grid2';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import {useRecoilValue, useSetRecoilState} from "recoil";
import {addCategoryOpen, filterDrawerOpen} from "./global/recoilMain";
import Button from "@mui/material/Button";
import TuneIcon from '@mui/icons-material/Tune';
import Tooltip from '@mui/material/Tooltip';

export default function Catalog() {
    const setAddCategoryOpen = useSetRecoilState(addCategoryOpen)
    const setOpenDrawer = useSetRecoilState(filterDrawerOpen)
    const filtered = useRecoilValue(filteredCatalog)
    return (
        <>
            <Grid container rowSpacing={4} columnSpacing={2} direction='row' justifyContent='space-evenly'>
                <Grid xs={12} sx={{display:'flex',justifyContent:'center'}}>
                    <Tooltip title="Filter Catalog Items" arrow>
                        <Button startIcon={<TuneIcon/>} sx={{px:10}} onClick={() => setOpenDrawer(true)}>
                            Filter
                        </Button>
                    </Tooltip>
                </Grid>
            {filtered.map(x => (
                <Grid xs='auto' key={x.key}>
                    <CatalogItem
                        sfItemID={x.key}
                    />
                </Grid>
            ))}
            </Grid>
            <Fab sx={{position: 'fixed', bottom: 16, right: 16,}} color='primary' variant='extended' onClick={() => setAddCategoryOpen(true)}>
                <AddIcon/> Add New Item
            </Fab>
        </>
    )
}