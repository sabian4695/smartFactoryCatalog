import React from 'react'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import {catalogListAtom} from "./global/CatalogList";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import {useRecoilValue, useSetRecoilState} from "recoil";
import {categoryItem, categoryOpen} from "./global/recoilMain";
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import Tooltip from '@mui/material/Tooltip';

export default function CatalogItem({sfItemID}: { sfItemID: any }) {
    const catalogList = useRecoilValue(catalogListAtom)
    let currentItem = catalogList.find(x => x.key === sfItemID)
    const setOpenModal = useSetRecoilState(categoryOpen)
    const setItemDetails = useSetRecoilState(categoryItem)
    function openItem() {
        //@ts-ignore
        setItemDetails(sfItemID)
        setOpenModal(true)
    }
    return (
        <>
            <Grow in={true}>
                <Paper sx={{ width: 345 }} elevation={3}>
                    <CardMedia
                        sx={{ height: 200 }}
                        image={currentItem?.imgURL}
                        component='img'
                        title={currentItem?.shortTitle}
                        alt={currentItem?.shortTitle}
                    />
                    <CardContent sx={{ height: 175, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                        <Box>
                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end'}}>
                                <Typography variant="caption" component="div">
                                    {currentItem?.shortTitle}
                                </Typography>
                                <Tooltip title="Status" arrow>
                                    <Chip
                                        sx={{mb:1}}
                                        label={currentItem?.status}
                                        color={currentItem?.status === "in progress" ? 'warning' : (currentItem?.status === "released" ? 'secondary' : 'default')}
                                    />
                                </Tooltip>
                            </Box>
                            <Typography variant="h5" component="div">
                                {currentItem?.longTitle}
                            </Typography>
                        </Box>

                        <Divider />
                        <Typography variant="body2" color="text.secondary">
                            {currentItem?.description}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{justifyContent:'space-between'}}>
                        <Button size="small" variant='outlined' onClick={openItem}>Learn More</Button>
                        {currentItem?.link === null ? null :
                            //@ts-ignore
                            <Tooltip title="Open website" arrow>
                                <Button size="small" variant='outlined' color='secondary' component='a' href={currentItem?.link} target='blank'>Visit</Button>
                            </Tooltip>
                        }
                    </CardActions>
                </Paper>
            </Grow>
        </>
    )
}