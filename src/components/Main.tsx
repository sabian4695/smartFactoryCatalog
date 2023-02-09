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
    loadingTitle, loadingOpen, areYouSure, areYouSureTitle, areYouSureDetails, areYouSureAccept
} from "./global/recoilMain";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import FilterDrawer from "../components/modals/FilterDrawer";
import EditCatalogItem from "../components/modals/EditCatalogItem";
import AreYouSure from "../components/modals/AreYouSure";
import Tooltip from '@mui/material/Tooltip';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import {cartItems, catalogListAtom, filteredCatalog} from './global/recoilTyped'
import {getCatalogItems} from "./helpers/api";
import {ListItem} from "@mui/material";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

let defaultTheme: string
if (localStorage.getItem('themeMode') !== null) {
    let def = localStorage.getItem('themeMode')
    defaultTheme = def === null ? 'light' : def
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
    const setUserId = useSetRecoilState(userIdAtom);
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
    const [catalogList, setCatalogList] = useRecoilState(catalogListAtom)
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
        //setUserRole(null)
        setLoadingMessage(null)
        setOpenLoad(false)
        setSnackSev('success')
        setSnackText('Logged Out')
        setSnackOpen(true)
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
        //@ts-ignore
        let newArray = cart.filter(function(el) { return el.id !== id; });
        setCart(newArray);
        setSnackSev('warning')
        setSnackText('Item removed')
        setSnackOpen(true)
    }

    React.useEffect(() => {
        setLoadingTitle('Getting Data')
        setOpenLoad(true)

        getCatalogItems(accessToken).then(response => {
            setCatalogList(response.catalogs)
            setFiltered(response.catalogs)
            setOpenLoad(false)
        })

    }, [])

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
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
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
                        maxWidth: 500
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
                    <Box key={'2'}>
                        <Typography sx={{ml:1}} fontWeight='bold' color='text.secondary' variant='subtitle2'>
                            Cart
                        </Typography>
                        {cart.map((option) => (
                            <>
                                <Tooltip title='Click to Remove' arrow>
                                    {/*@ts-ignore*/}
                                    <MenuItem key={option.id} onClick={() => removeCartItem(option.id)}>
                                        {/*@ts-ignore*/}
                                        <ListItemText>{option.title}</ListItemText>
                                        <ListItemIcon sx={{ml:2, mr:-2}}>
                                            <DeleteIcon/>
                                        </ListItemIcon>
                                    </MenuItem>
                                </Tooltip>
                            </>
                        ))}
                        <ListItem disablePadding sx={{mt:1}}>
                            <Tooltip title='Informs Smart Factory team that you are interested in what you have selected!' arrow>
                                <Button
                                    sx={{mx:1}}
                                    fullWidth
                                    key={'1'}
                                    variant='contained'
                                    disableElevation color='secondary' size='small'
                                >
                                    Send Cart
                                </Button>
                            </Tooltip>
                        </ListItem>
                    </Box>
                }
            </Menu>
            <Snackbar
                open={snackOpen}
                autoHideDuration={2000}
                onClose={snackClose}>
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
