import React from 'react'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import {catalogListAtom, cartItems, cartItem, imgData} from "./global/recoilTyped";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
    categoryItem,
    categoryOpen,
    snackBarOpen,
    snackBarSeverity,
    snackBarText
} from "./global/recoilMain";
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
    const imageData = useRecoilValue(imgData);
    function openItem() {
        setItemDetails(sfItemID)
        setOpenModal(true)
    }
    function addToCart() {
        if (cart.find(x => x.id === sfItemID)) {
            setSnackSev('error')
            setSnackText('Error: Item already in cart')
            setSnackOpen(true)
            return
        }
        let newItem: cartItem = {
            id: sfItemID,
            title: currentItem === undefined ? '' : currentItem.title
        }
        setCart((prevState: any) => [...prevState, newItem])
        setSnackSev('success')
        setSnackText('Item added to cart')
        setSnackOpen(true)
    }
    function getPhoto(): string{
        if (currentItem?.imgURL !== '') {
            let result = imageData.find(x => x.id === currentItem?.recordId)?.img
            return result === undefined ? '' : result
        } else {
            return ''
        }
    }
    let src: string = getPhoto()

    return (
        <>
            <Grow in={true}>
                <Box component='div' sx={{position:'relative'}}>
                    <Paper sx={{ width: 345, borderRadius:2 }} elevation={3}>
                        {currentItem?.webLink === '' ? null :
                            <Tooltip title="Open Website" arrow>
                                <Button
                                    size="small"
                                    variant='contained'
                                    color='secondary'
                                    component='a'
                                    //@ts-ignore
                                    href={currentItem?.webLink}
                                    target='blank'
                                    sx={{left:8,top:160,position:'absolute'}}
                                >
                                    Visit
                                </Button>
                            </Tooltip>
                        }
                        {currentItem?.reportLink ===  '' ? null :
                            <Tooltip title="Open Report" arrow>
                                <Button
                                    size="small"
                                    variant='contained'
                                    color='secondary'
                                    component='a'
                                    //@ts-ignore
                                    href={currentItem?.reportLink}
                                    target='blank'
                                    sx={{right:8,top:160,position:'absolute'}}
                                >
                                    Report
                                </Button>
                            </Tooltip>
                        }
                        <CardMedia
                            sx={{ height: 200 }}
                            //@ts-ignore
                            src={src}
                            component='img'
                            title={currentItem?.title}
                            alt={currentItem?.title}
                        />
                        <CardContent sx={{ height: 185, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                            <Box>
                                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end'}}>
                                    <Tooltip title="Status" arrow>
                                        <Chip
                                            label={currentItem?.status}
                                            color={currentItem?.status === "in progress" ? 'warning' : (currentItem?.status === "released" ? 'success' : 'default')}
                                        />
                                    </Tooltip>
                                </Box>
                                <Typography variant="h5" component="div">
                                    {currentItem?.title}
                                </Typography>
                            </Box>
                            <Box display='flex'>
                                <Tooltip title="Software Available" arrow>
                                    <Box>
                                        {currentItem?.typeAvailable.map(x => (
                                            <Chip label={x} size='small' sx={{mr:0.5, mb:0.5}} key={x}/>
                                        ))}
                                    </Box>
                                </Tooltip>
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