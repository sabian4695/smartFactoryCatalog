import React from 'react'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import {catalogListAtom} from "./global/CatalogList";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {cartItems, categoryItem, categoryOpen, snackBarOpen, snackBarSeverity, snackBarText} from "./global/recoilMain";
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DoneIcon from '@mui/icons-material/Done';
import Icon from '@mui/material/Icon';

export default function CatalogItem({sfItemID}: { sfItemID: any }) {
    const catalogList = useRecoilValue(catalogListAtom)
    let currentItem = catalogList.find(x => x.recordId === sfItemID)
    const setOpenModal = useSetRecoilState(categoryOpen)
    const setItemDetails = useSetRecoilState(categoryItem)
    const [cart, setCart] = useRecoilState(cartItems)
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    function openItem() {
        //@ts-ignore
        setItemDetails(sfItemID)
        setOpenModal(true)
    }
    function addToCart() {
        //@ts-ignore
        if (cart.find(x => x.id === sfItemID)) {
            setSnackSev('error')
            setSnackText('Error: Item already in cart')
            setSnackOpen(true)
            return
        }

        let newItem = {
            id: sfItemID,
            title: currentItem === undefined ? '' : currentItem.longTitle
        }
        //@ts-ignore
        setCart((prevState: any) => [...prevState, newItem])
        setSnackSev('success')
        setSnackText('Item added to cart')
        setSnackOpen(true)
    }
    return (
        <>
            <Grow in={true}>
                <Box component='div' sx={{position:'relative'}}>
                    <Paper sx={{ width: 345 }} elevation={3}>
                        {currentItem?.link === null ? null :
                            //@ts-ignore
                            <Tooltip title="Open website" arrow>
                                <Button
                                    size="small"
                                    variant='contained'
                                    color='secondary'
                                    component='a'
                                    href={currentItem?.link}
                                    target='blank'
                                    sx={{left:8,top:160,position:'absolute'}}
                                >
                                    Visit
                                </Button>
                            </Tooltip>
                        }
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
                            {//@ts-ignore
                                cart.find(x => x.id === currentItem.recordId) ?
                                    <Icon color='inherit'><DoneIcon/></Icon>
                                    :
                                    <Tooltip title='Add to Cart' arrow>
                                        <IconButton onClick={addToCart} size='small'>
                                            <AddShoppingCartIcon/>
                                        </IconButton>
                                    </Tooltip>
                            }
                        </CardActions>
                    </Paper>
                </Box>
            </Grow>
        </>
    )
}