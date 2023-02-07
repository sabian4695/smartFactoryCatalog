import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
    categoryOpen,
    categoryItem,
    editCatagoryOpen,
    snackBarText,
    snackBarSeverity,
    snackBarOpen, cartItems
} from '../global/recoilMain'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {catalogListAtom, filteredCatalog} from '../global/CatalogList'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from "@mui/material/Typography";
import React from "react";
import Chip from "@mui/material/Chip";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {areYouSure, areYouSureDetails, areYouSureTitle, areYouSureAccept} from "../global/recoilMain";
import Tooltip from '@mui/material/Tooltip';
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

export default function CatalogDetails() {
    const [openModal, setOpenModal] = useRecoilState(categoryOpen)
    const setEditOpen = useSetRecoilState(editCatagoryOpen)
    const itemID = useRecoilValue(categoryItem)
    const [catalogList, setCatalogList] = useRecoilState(catalogListAtom)
    let currentItem = catalogList.find(x => x.recordId === itemID)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [itemDelete, setItemDelete] = React.useState(false)
    const moreOpen = Boolean(anchorEl);
    const setSnackText = useSetRecoilState(snackBarText);
    const setSnackSev = useSetRecoilState(snackBarSeverity);
    const setSnackOpen = useSetRecoilState(snackBarOpen);
    const [areYouSureOpen, setAreYouSureOpen] = useRecoilState(areYouSure);
    const setCheckTitle = useSetRecoilState(areYouSureTitle);
    const setCheckDetails = useSetRecoilState(areYouSureDetails);
    const [checkAccept, setCheckAccept] = useRecoilState(areYouSureAccept);
    const setFiltered = useSetRecoilState(filteredCatalog)
    const [cart, setCart] = useRecoilState(cartItems)
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    function editClick() {
        setAnchorEl(null)
        setOpenModal(false)
        setEditOpen(true)
    }

    async function handleDoubleCheck() {
        setItemDelete(true)
        setAnchorEl(null);
        setCheckTitle('Are you sure you want to delete this item?')
        setCheckDetails('WARNING: You cannot undo this action')
        setAreYouSureOpen(true)
    }
    React.useEffect(() => {
        if(!areYouSureOpen) {
            if(checkAccept) {
                handleDelete()
            }
            setItemDelete(false)
        }
    }, [areYouSureOpen])
    async function handleDelete() {
        if (!itemDelete) {return}
        let newArray = catalogList.filter(function(el) { return el.recordId !== itemID; });
        setCatalogList(newArray);
        setFiltered(newArray)
        setOpenModal(false)
        setSnackSev('success')
        setSnackText('Item deleted')
        setSnackOpen(true)
        setCheckAccept(false)
        setItemDelete(false)
    }
    function addToCart() {
        //@ts-ignore
        if (cart.find(x => x.id === itemID)) {
            setSnackSev('error')
            setSnackText('Error: Item already in cart')
            setSnackOpen(true)
            return
        }
        let newItem = {
            id: itemID,
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
            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                scroll='body'
            >
                <DialogTitle sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <Tooltip title="Options" arrow>
                        <IconButton
                            size='small'
                            aria-label="more"
                            aria-controls={moreOpen ? 'long-menu' : undefined}
                            aria-expanded={moreOpen ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                            sx={{mr:0.5, ml:-1}}
                        >
                            <MoreVertIcon/>
                        </IconButton>
                    </Tooltip>
                    <div style={{flexGrow:'1'}}>
                        {currentItem?.longTitle}
                    </div>
                    <IconButton color="secondary" onClick={() => setOpenModal(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <img src={currentItem?.imgURL} style={{maxHeight:500, maxWidth:'100%', display:'flex',flexGrow:'1', justifySelf:'center',alignSelf:'center'}} loading='lazy'/>
                <DialogContent>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Typography variant="caption" component="div" display='inline'>
                            {currentItem?.shortTitle}
                        </Typography>
                        <Tooltip title="Status" arrow>
                            <Chip
                                label={currentItem?.status}
                                color={currentItem?.status === "in progress" ? 'warning' : (currentItem?.status === "released" ? 'secondary' : 'default')}
                            />
                        </Tooltip>
                    </Box>
                    <Typography>
                        {currentItem?.description}
                    </Typography>
                    <DialogContentText sx={{mb:1}}>
                        {currentItem?.details}
                    </DialogContentText>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Box>
                            <Typography display='inline' color='text.secondary'>
                                Adopted by:
                            </Typography>
                            {/*@ts-ignore*/}
                            {currentItem?.unitAdoption.map(x => (
                                <Chip size='small' sx={{mx:0.5}} key={x} color='primary' variant='outlined' label={x}/>
                            ))}
                        </Box>
                        <Button
                            onClick={addToCart}
                            variant='contained'
                            disableElevation
                            sx={{color:'#FFFFFF'}}
                            startIcon={<AddShoppingCartIcon/>}
                            //@ts-ignore
                            disabled={!!cart.find(x => x.id === itemID)}
                        >
                            Add to Cart
                        </Button>
                    </Box>
                    {currentItem?.link === null ? null :
                        //@ts-ignore
                        <Button size="small"
                                variant='outlined'
                                color='secondary'
                                sx={{mt:1, display:'flex'}}
                                component='a'
                                href={currentItem?.link} target='blank'>Visit Website</Button>
                    }
                </DialogContent>
            </Dialog>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={moreOpen}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={editClick}>
                    <EditIcon sx={{mr:1}}/>
                    Edit Item
                </MenuItem>
                <MenuItem onClick={handleDoubleCheck}>
                    <DeleteIcon sx={{mr:1}}/>
                    Delete Item
                </MenuItem>
            </Menu>
        </>
    )
}