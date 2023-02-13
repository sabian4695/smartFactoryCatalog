import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Catalog from '../components/Catalog'
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../assets/5 Nifco White Thick - Large.png'
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import CatalogDetails from "../components/modals/CatalogDetails";
import LogoutIcon from '@mui/icons-material/Logout';
import AddCatalogItem from '../components/modals/AddCatalogItem'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {
    snackBarOpen,
    snackBarText,
    snackBarSeverity,
    accessTokenAtom,
    userIdAtom,
    refreshTokenAtom,
    accessExpiryAtom,
    refreshExpiryAtom,
    loggedInUserAtom,
    loadingMessageSelector,
    loadingTitle, loadingOpen, areYouSure, areYouSureTitle, areYouSureDetails, areYouSureAccept, userRole
} from "./global/recoilMain";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import FilterDrawer from "../components/modals/FilterDrawer";
import EditCatalogItem from "../components/modals/EditCatalogItem";
import AreYouSure from "../components/modals/AreYouSure";
import Tooltip from '@mui/material/Tooltip';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import {cartItems, catalogListAtom, filteredCatalog, imgData, imgItem} from './global/recoilTyped'
import {getAppRoles, getCatalogItems, getUploadUrl, getUserInfo} from "./helpers/api";
import {ListItem, ListItemButton} from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import {deleteData, getDataString, storeData, storeSessionData} from "./helpers/storage";
import {getBase64FromUrl, resizeImage} from "./helpers/misc";
import {createEmailBody} from "./helpers/emailTemplate";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

let defaultTheme: string
if (localStorage.getItem('themeMode') !== null) {
    let def = localStorage.getItem('themeMode')
    defaultTheme = (def === null ? 'light' : def)
} else {
    defaultTheme = 'light'
    localStorage.setItem('themeMode','light')
}

function Main() {
    const [mode, setMode] = React.useState(defaultTheme);
    const [cart, setCart] = useRecoilState(cartItems)
    const [snackSev, setSnackSev] = useRecoilState(snackBarSeverity);
    const [snackOpen, setSnackOpen] = useRecoilState(snackBarOpen);
    const [snackText, setSnackText] = useRecoilState(snackBarText);
    const setAccessToken = useSetRecoilState(accessTokenAtom);
    const [userId, setUserId] = useRecoilState(userIdAtom);
    const setRefreshToken = useSetRecoilState(refreshTokenAtom);
    const setAccessExpiry = useSetRecoilState(accessExpiryAtom);
    const setRefreshExpiry = useSetRecoilState(refreshExpiryAtom);
    const setLoggedInUser = useSetRecoilState(loggedInUserAtom);
    const setLoadingMessage = useSetRecoilState(loadingMessageSelector);
    const setLoadingTitle = useSetRecoilState(loadingTitle);
    const setOpenLoad = useSetRecoilState(loadingOpen);
    const [logout, setLogout] = React.useState(false)
    const [areYouSureOpen, setAreYouSureOpen] = useRecoilState(areYouSure);
    const setCheckTitle = useSetRecoilState(areYouSureTitle);
    const setCheckDetails = useSetRecoilState(areYouSureDetails);
    const [checkAccept, setCheckAccept] = useRecoilState(areYouSureAccept);
    const [imageData, setImageData] = useRecoilState(imgData);
    const setCatalogList = useSetRecoilState(catalogListAtom)
    const setUserRole = useSetRecoilState(userRole);
    const accessToken = useRecoilValue(accessTokenAtom)
    const setFiltered = useSetRecoilState(filteredCatalog)

    function setTheme() {
        if(mode === 'light') {
            setMode('dark')
            localStorage.setItem('themeMode','dark')
            setSnackSev('success')
            setSnackText('Dark mode activated')
            setSnackOpen(true)
        } else {
            setMode('light')
            localStorage.setItem('themeMode','light')
            setSnackSev('success')
            setSnackText('Initiated light mode')
            setSnackOpen(true)
        }
    }
    const theme = createTheme({
        palette: {
            //@ts-ignore
            mode: mode,
            primary: {
                main: '#ff6B00',
            },
            secondary: {
                main: '#0095ff',
            }
        }
    });
    const notMobile = useMediaQuery(theme.breakpoints.up('sm'));
    React.useEffect(() => {
        if(!areYouSureOpen) {
            if(checkAccept) {
                handleLogout()
            }
            setLogout(false)
        }
    }, [areYouSureOpen])
    async function handleLogout() {
        if (!logout) {return}
        setLoadingMessage('Logging Out')
        setLoadingTitle('Logging Out')
        setOpenLoad(true)
        setUserId(null);
        setAccessToken(null);
        setRefreshToken(null);
        setAccessExpiry(null);
        setRefreshExpiry(null);
        setLoggedInUser(null);
        setLoggedInUser(null);
        setUserRole('')
        setCart([])
        deleteData('cart')
        setLoadingMessage(null)
        setOpenLoad(false)
        setCheckAccept(false)
        setLogout(false)
    }
    async function handleLogoutClick() {
        setLogout(true)
        setAnchorEl(null);
        setCheckTitle('Are you sure you want to logout?')
        setCheckDetails('You can always just sign in again, I guess.')
        setAreYouSureOpen(true)
    }
    const snackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {return}
        setSnackOpen(false);
    };
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    function removeCartItem(id: string) {
        let newArray = cart.filter(function(x) { return x.id !== id; });
        setCart(newArray);
        setSnackSev('warning')
        setSnackText('Item removed')
        setSnackOpen(true)
    }
    let first = 0
    async function pullImage(id: string) {


        if(imageData.find(x => x.id === id)) {return}
        let imageURL = await getUploadUrl(accessToken, id, 'image/jpeg','GET')
        //@ts-ignore
        let image: string = await getBase64FromUrl(imageURL)
        let resized: string = await resizeImage(image, 500, 500)

        if (first === 0) { //if array is empty
            first = 1
            setImageData([{id: id, img: resized}])
        } else if(imageData.find(x => x.id === id)) { //if item is already in array
            let newArray: imgItem[] = imageData.map(obj => {
                if (obj.id === id) {
                    return {...obj,
                        img: resized
                    }
                }
                return obj;
            })
            setImageData(newArray)
        } else { //if item is not in array
            setImageData((prevState: any) => [...prevState, {id:id, img: resized}])
        }
    }

    React.useEffect(() => {
        setLoadingTitle('Getting Data')
        setOpenLoad(true)

        getCatalogItems(accessToken).then(response => {
            response.catalogs.forEach(async (x: any) => {
                if(x.imgURL === 'exists') {
                   await pullImage(x.recordId).then()
                }
            })

            setCatalogList(response.catalogs)
            setFiltered(response.catalogs)
            setOpenLoad(false)
        })
        getAppRoles(accessToken).then(response => {
            if(response.roles[0] === '554a0a44-5674-4704-9bf5-54915a647103') {
                setUserRole('admin')
            } else if(response.roles[0] === '7c026fb3-514c-4911-b047-b7c5193ab0ca') {
                setUserRole('viewer')
            } else(
                setUserRole('')
            )
        })
    }, [])

    React.useEffect(() => {
        storeData('cart',JSON.stringify(cart))
    }, [cart])
    React.useEffect(() => {
        //storeSessionData('imgData',JSON.stringify(imageData))
    }, [imageData])

    async function handleSendCart() {
        setLoadingTitle('Sending Cart')
        setOpenLoad(true)

        // await getUserInfo(accessToken, userId).then(response => {
        //     console.log(response)
        // })

        let emailText: string = createEmailBody(getDataString('loggedInUser'),cart.map(x => x.title))

        let cartArr = ''
        cart.forEach(x => cartArr = cartArr + encodeURIComponent(x.title + '\n'))

        window.location.href = 'mailto: support@nifco.zendesk.com&subject=' + encodeURIComponent('Smart Factory Catalog Information Request') +
            //@ts-ignore
            '&body=' + encodeURIComponent(getDataString('loggedInUser')) + encodeURIComponent(' requested information regarding the following Smart Factory Catalog Items\n') +
            + cartArr

        //send cart
        setOpenLoad(false)
        setSnackSev('success')
        setSnackText('Cart sent to Smart Factory Team')
        setSnackOpen(true)
    }

    return (
        <ThemeProvider theme={theme}>
            <Box>
                <CssBaseline />
                <Box sx={{flexGrow: 1}}>
                    <AppBar position="fixed" sx={mode === 'light' ? {backgroundColor:'#eeeeee'} : {backgroundColor:'#151515'}} elevation={2}>
                        <Toolbar>
                            <img
                                src={logo}
                                height='40'
                                alt='logo'
                            >
                            </img>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1, ml:1}}>
                                Smart Factory Catalog
                            </Typography>
                            <Typography display='inline'>
                                {theme.palette.mode} mode
                            </Typography>
                            <Tooltip title="Change Theme" arrow>
                                <IconButton onClick={setTheme} color="inherit">
                                    {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Cart" arrow>
                                <IconButton
                                    sx={{ ml: 1 }}
                                    color="inherit"
                                    onClick={(event: React.MouseEvent<HTMLElement>) => {setAnchorEl(event.currentTarget)}}
                                >
                                    <Badge badgeContent={cart.length} color="secondary">
                                        <ShoppingCartIcon/>
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Logout" arrow>
                                <IconButton sx={{ ml: 1 }} color="inherit" onClick={handleLogoutClick}>
                                    <LogoutIcon/>
                                </IconButton>
                            </Tooltip>
                        </Toolbar>
                    </AppBar>
                </Box>
                <Box component="main" sx={{p: 3}}>
                    <Toolbar/>
                    <Catalog/>
                </Box>
            </Box>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={openMenu}
                onClose={() => {setAnchorEl(null)}}
                PaperProps={{
                    style: {
                        maxHeight: 500,
                        minWidth: 300,
                        maxWidth: 350
                    },
                }}
            >
                {cart.length === 0 ?
                    <Box sx={{mx:1}}>
                        <Typography color='text.secondary' sx={{fontWeight: '600'}}>
                            No items added yet.
                        </Typography>
                        <Typography variant='subtitle2'>
                            Tip - add items to your cart to send to the smart factory team.
                            This tells us you're interested in these products, and we will reach out to you.
                        </Typography>
                    </Box>
                    :
                    <Box>
                        <Typography sx={{ml:1}} fontWeight='bold' color='text.secondary' variant='subtitle2'>
                            Cart
                        </Typography>
                        <Tooltip title='Click to Remove' arrow placement='top'>
                            <Box>
                                {cart.map((option) => (
                                        <ListItem disablePadding key={option.id} onClick={() => removeCartItem(option.id)}>
                                            <ListItemButton>
                                                <ListItemText>
                                                    {option.title}
                                                </ListItemText>
                                                <ListItemIcon sx={{mr:-4}}>
                                                    <DeleteIcon/>
                                                </ListItemIcon>
                                            </ListItemButton>
                                        </ListItem>
                                ))}
                            </Box>
                        </Tooltip>
                        <ListItem disablePadding sx={{mt:1}} key={'4'}>
                            <Tooltip title='Informs Smart Factory team that you are interested in what you have selected!' arrow>
                                <Button
                                    sx={{mx:1}}
                                    fullWidth
                                    variant='contained'
                                    disableElevation color='secondary' size='small'
                                    onClick={handleSendCart}
                                >
                                    Send Cart to Team
                                </Button>
                            </Tooltip>
                        </ListItem>
                    </Box>
                }
            </Menu>
            <Snackbar
                open={snackOpen}
                autoHideDuration={2000}
                onClose={snackClose}
                sx={notMobile ? undefined : {mb:8}}
            >
                {/*@ts-ignore*/}
                <Alert onClose={snackClose} severity={snackSev} sx={{width: '100%'}}>
                    {snackText}
                </Alert>
            </Snackbar>
            <CatalogDetails/>
            <AddCatalogItem/>
            <EditCatalogItem/>
            <FilterDrawer/>
            <AreYouSure/>
        </ThemeProvider>
    );
    }

export default Main;
