import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
    categoryOpen,
    categoryItem,
    editCategoryOpen,
    snackBarText,
    snackBarSeverity,
    snackBarOpen, accessTokenAtom, loadingTitle, loadingOpen, userRole
} from '../global/recoilMain'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {catalogListAtom, filteredCatalog, cartItems, cartItem, imgData} from '../global/recoilTyped'
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
import {deletePhoto, deleteTableItem} from "../helpers/api";

export default function CatalogDetails() {
    const [openModal, setOpenModal] = useRecoilState(categoryOpen)
    const accessToken = useRecoilValue(accessTokenAtom)
    const setEditOpen = useSetRecoilState(editCategoryOpen)
    const setLoadingTitle = useSetRecoilState(loadingTitle);
    const setOpenLoad = useSetRecoilState(loadingOpen);
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
    const imageData = useRecoilValue(imgData);
    const userRoleName = useRecoilValue(userRole)
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
        if(userRoleName !== 'admin') {
            setSnackSev('error')
            setSnackText('Must be admin to do this')
            setSnackOpen(true)
            return
        }
        setLoadingTitle('Deleting item')
        setOpenLoad(true)

        await deletePhoto(accessToken,itemID)

        await deleteTableItem(accessToken, itemID).then(() => {
            let newArray = catalogList.filter(function(el) { return el.recordId !== itemID; });
            setCatalogList(newArray);
            setFiltered(newArray)
            setOpenModal(false)
            setSnackSev('success')
            setSnackText('Item deleted')
            setSnackOpen(true)
            setCheckAccept(false)
            setItemDelete(false)
            setOpenLoad(false)
        })
    }

    function addToCart() {
        if (cart.find(x => x.id === itemID)) {
            setSnackSev('error')
            setSnackText('Error: Item already in cart')
            setSnackOpen(true)
            return
        }
        let newItem: cartItem = {
            id: itemID,
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
            if (result === null || result === undefined) {
                return ''
            } else {
                return result
            }
        } else {
            return ''
        }
    }
    let src: string = getPhoto()
    return (
        <>
            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                scroll='body'
            >
                <DialogTitle sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    {userRoleName === 'admin' ?
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
                        : null
                    }
                    <div style={{flexGrow:'1'}}>
                        {currentItem?.title}
                    </div>
                    <IconButton color="secondary" onClick={() => setOpenModal(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                {/*@ts-ignore*/}
                <img alt={currentItem?.title} src={src} style={{maxHeight:500, maxWidth:'100%', display:'flex',flexGrow:'1', justifySelf:'center',alignSelf:'center'}} loading='lazy'/>
                <DialogContent>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end'}}>
                        <Tooltip title="Software Available" arrow>
                            <Box>
                                {currentItem?.typeAvailable.map(x => (
                                    <Chip label={x} size='small' sx={{mr:0.5, mb:0.5}} key={x}/>
                                ))}
                            </Box>
                        </Tooltip>
                        <Tooltip title="Status" arrow>
                            <Chip
                                label={currentItem?.status}
                                color={currentItem?.status === "in progress" ? 'warning' : (currentItem?.status === "released" ? 'success' : 'default')}
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
                            <Box>
                                {currentItem?.unitAdoption.length === 0 ? null :
                                    <Typography display='inline' color='text.secondary'>
                                        Unit Adoption:
                                    </Typography>
                                }
                                {/*@ts-ignore*/}
                                {currentItem?.unitAdoption.map(x => (
                                    <Chip size='small' sx={{mx:0.5}} key={x} color='primary' variant='outlined' label={x}/>
                                ))}
                            </Box>
                            <Box>
                                {currentItem?.department.length === 0 ? null :
                                    <Typography display='inline' color='text.secondary'>
                                        Department Adoption:
                                    </Typography>
                                }
                                {/*@ts-ignore*/}
                                {currentItem?.department.map(x => (
                                    <Chip size='small' sx={{mx:0.5}} key={x} color='secondary' variant='outlined' label={x}/>
                                ))}
                            </Box>
                            <Box>
                                {currentItem?.org.length === 0 ? null :
                                    <Typography display='inline' color='text.secondary'>
                                        Org Adoption:
                                    </Typography>
                                }
                                {/*@ts-ignore*/}
                                {currentItem?.org.map(x => (
                                    <Chip size='small' sx={{mx:0.5}} key={x} color='secondary' variant='outlined' label={x}/>
                                ))}
                            </Box>
                        </Box>
                        <Button
                            onClick={addToCart}
                            variant='contained'
                            disableElevation
                            sx={{color:'#FFFFFF'}}
                            startIcon={<AddShoppingCartIcon/>}
                            disabled={!!cart.find(x => x.id === itemID)}
                        >
                            Add to Cart
                        </Button>
                    </Box>
                    {currentItem?.webLink === '' ? null :
                        <Button size="small"
                                variant='outlined'
                                color='secondary'
                                sx={{mt:1, display:'flex'}}
                                component='a'
                                //@ts-ignore
                                href={currentItem?.webLink} target='blank'>Visit Website</Button>
                    }
                    {(currentItem?.displayLink === '' || currentItem?.displayLink === undefined) ? null :
                        <Button size="small"
                                variant='outlined'
                                color='secondary'
                                sx={{mt:1, display:'flex'}}
                                component='a'
                            //@ts-ignore
                                href={currentItem?.displayLink} target='blank'>Open Display</Button>
                    }
                    {currentItem?.reportLink === '' ? null :
                        <Button size="small"
                                variant='outlined'
                                color='secondary'
                                sx={{mt:1, display:'flex'}}
                                component='a'
                                //@ts-ignore
                                href={currentItem?.reportLink} target='blank'>See Reports</Button>
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